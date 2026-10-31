// Google Apps Script code to paste into Extensions > Apps Script in Google Sheets
// After pasting, click "Deploy" > "New deployment" > Select type "Web app":
// - Execute as: "Me"
// - Who has access: "Anyone"
// Copy the Web App URL and set it as GitHub Secret VITE_GOOGLE_SHEET_URL (or provide it).

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let statsSheet = ss.getSheetByName('Stats');
  if (!statsSheet) {
    statsSheet = ss.insertSheet('Stats');
    statsSheet.appendRow(['postId', 'likes', 'shares', 'views']);
    statsSheet.appendRow(['moon', 0, 0, 0]);
    statsSheet.appendRow(['silver-emblem', 0, 0, 0]);
  }
  
  let commentsSheet = ss.getSheetByName('Comments');
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet('Comments');
    commentsSheet.appendRow(['timestamp', 'postId', 'comment']);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupSheets();
  
  const statsSheet = ss.getSheetByName('Stats');
  const commentsSheet = ss.getSheetByName('Comments');
  
  const statsData = statsSheet.getDataRange().getValues();
  const likes = {};
  const shares = {};
  const views = {};
  
  for (let i = 1; i < statsData.length; i++) {
    const [postId, likeCount, shareCount, viewCount] = statsData[i];
    if (postId) {
      likes[postId] = Number(likeCount) || 0;
      shares[postId] = Number(shareCount) || 0;
      views[postId] = Number(viewCount) || 0;
    }
  }
  
  const commentsData = commentsSheet.getDataRange().getValues();
  const comments = {};
  for (let i = 1; i < commentsData.length; i++) {
    const [, postId, commentText] = commentsData[i];
    if (postId && commentText) {
      if (!comments[postId]) comments[postId] = [];
      comments[postId].push(String(commentText));
    }
  }
  
  const result = {
    likes,
    shares,
    views,
    comments
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheets();
    
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const { action, postId, comment } = body;
    
    if (!postId) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Missing postId' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const statsSheet = ss.getSheetByName('Stats');
    const statsData = statsSheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < statsData.length; i++) {
      if (statsData[i][0] === postId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      statsSheet.appendRow([postId, 0, 0, 0]);
      rowIndex = statsSheet.getLastRow();
    }
    
    if (action === 'like') {
      const current = Number(statsSheet.getRange(rowIndex, 2).getValue()) || 0;
      statsSheet.getRange(rowIndex, 2).setValue(current + 1);
    } else if (action === 'unlike') {
      const current = Number(statsSheet.getRange(rowIndex, 2).getValue()) || 0;
      statsSheet.getRange(rowIndex, 2).setValue(Math.max(0, current - 1));
    } else if (action === 'share') {
      const current = Number(statsSheet.getRange(rowIndex, 3).getValue()) || 0;
      statsSheet.getRange(rowIndex, 3).setValue(current + 1);
    } else if (action === 'view') {
      const current = Number(statsSheet.getRange(rowIndex, 4).getValue()) || 0;
      statsSheet.getRange(rowIndex, 4).setValue(current + 1);
    } else if (action === 'comment' && comment) {
      const commentsSheet = ss.getSheetByName('Comments');
      commentsSheet.appendRow([new Date().toISOString(), postId, comment]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
