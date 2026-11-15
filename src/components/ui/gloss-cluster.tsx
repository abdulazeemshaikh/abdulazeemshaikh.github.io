"use client"

/**
 * Gloss Cluster · Louis Studios · https://studios.lou15.com/c/gloss-cluster
 * Licensed to device (no account) · License LS-858M-TBCW · 2026-11-14
 * License: personal use only (free coins). Your own non-commercial projects; no client or paid work.
 * No sharing, redistribution or resale, and no use in kits, templates, libraries or AI training data.
 * Every copy is traceable to its license. Terms: https://studios.lou15.com/license
 */

import * as React from "react"

/** Which part of the reel plays. */
export type GlossClusterSequence = "full" | "cluster"

export interface GlossClusterProps {
  /**
   * The six gradient colours every object is shaded from, in this order: hot pink, coral red,
   * violet, cobalt, cyan, lime. Any CSS colours. Each object blends three or four of them across
   * its surface like a matcap, so keep them saturated. Default: the reference's neon set.
   */
  colors?: string[]
  /** Stage colour behind the cluster and the title card. Any CSS background. Default "#000000". Use "transparent" to sit on your own surface. */
  background?: string
  /** Bold condensed wordmark on the title card. Default "LOUIS STUDIOS". */
  wordmark?: string
  /** Number that rolls in after the wordmark like a glitching slot reel and settles. Two digits look best. Default 15. */
  number?: number | string
  /** Colour of the wordmark. Default "#ffffff". */
  textColor?: string
  /** Colour of the rolling number. Default "#a4a4a6", the reference's grey. */
  numberColor?: string
  /** Font stack for the title card. The wordmark is drawn heavy and condensed, the number regular. Default "\"Helvetica Neue\", Helvetica, Arial, sans-serif". */
  font?: string
  /**
   * "full" (default) plays the reference reel: the cluster drifts, collapses into the centre, cuts to
   * the title card with the rolling number, flashes the gradient mark and bursts back out into the
   * cluster. "cluster" keeps the drifting cluster on screen with no cuts.
   */
  sequence?: GlossClusterSequence
  /** Playback speed. 1 = the reference's pace (one reel every 4.6 s). 0 freezes the reel; the pointer still works. */
  speed?: number
  /** Pointer parallax, objects shy away from the pointer, and a click makes them pop and settle. Default true. */
  interactive?: boolean
  /** Accessible name. The scene is announced as an image with this text. Default "Cluster of glossy 3D icons around the Louis Studios mark". */
  ariaLabel?: string
  /** Class for the root element. The component fills its parent: give the parent (or this class) a size. */
  className?: string
  /** Inline style for the root element. */
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------------------------
// Default colours (the reference's neon set) and fixed tints.

const DEFAULT_COLORS = [
  "#ff3f8e", // hot pink
  "#f75a4c", // coral red
  "#7c3cfd", // violet
  "#1c12fa", // cobalt
  "#45c6d4", // cyan
  "#2efc6a", // lime
]
/** Deep plum used in the shadowed side of every object. */
const SHADOW_COLOR = "#1b0a2c"
/** Specular highlight and the white of the centre mark. */
const HIGHLIGHT_COLOR = "#fff4fb"
/** Soft lavender in the rim of the white centre mark. */
const MARK_RIM_COLOR = "#d9cdf6"

/** Louis Studios mark, from public/brand/mark-solid.svg (viewBox 337 309 532 544). */
const MARK_PATH =
  "M466.0 847.5C468.2 847.2 470.5 846.7 472.5 845.8C484.4 840.0 495.5 832.8 507.5 827.3C512.6 825.0 518.1 823.6 523.5 822.3C528.1 821.3 532.8 820.6 537.5 820.3C543.5 820.0 549.5 820.2 555.5 820.7C566.2 821.5 576.8 823.3 587.5 824.3C594.5 825.0 601.5 825.6 608.5 825.6C637.2 825.9 665.8 824.9 694.5 825.3C699.9 825.4 705.2 826.3 710.5 827.3C719.2 829.0 727.7 832.0 736.5 833.3C743.4 834.3 750.5 834.3 757.5 834.3C760.5 834.2 763.5 833.6 766.5 833.0C789.2 828.2 811.9 823.2 834.5 818.0C837.1 817.4 839.6 816.5 842.0 815.5C844.9 814.3 847.9 813.1 850.5 811.3C853.8 808.9 857.0 806.2 859.5 803.0C861.2 800.8 862.1 798.1 862.8 795.5C863.3 793.6 863.3 791.5 863.0 789.5C862.8 787.4 862.4 785.3 861.4 783.5C859.9 780.9 858.1 778.5 855.9 776.5C853.4 774.2 850.6 772.2 847.5 770.7C838.0 766.0 827.9 762.8 818.5 758.0C815.2 756.3 812.3 754.0 809.6 751.5C807.9 749.9 806.3 748.1 805.5 745.9C804.3 742.6 803.4 739.0 803.7 735.5C804.7 722.7 807.8 710.2 809.3 697.5C809.9 692.9 809.9 688.2 809.8 683.5C809.8 679.8 809.6 676.1 809.1 672.5C808.5 668.1 807.8 663.8 806.6 659.5C805.7 655.7 804.4 652.1 802.8 648.5C801.3 645.0 799.5 641.7 797.5 638.4C795.6 635.3 793.5 632.2 791.1 629.5C786.9 624.9 782.7 620.3 777.8 616.5C772.1 612.0 765.9 608.1 759.5 604.6C752.8 601.0 745.7 597.9 738.5 595.4C723.0 590.0 707.1 585.9 691.5 580.9C687.4 579.6 683.3 578.3 679.5 576.4C675.6 574.5 671.8 572.1 668.4 569.5C667.0 568.5 666.0 567.0 665.2 565.5C664.3 563.9 663.6 562.3 663.2 560.5C662.9 558.9 662.9 557.2 663.1 555.5C663.3 554.1 663.7 552.7 664.5 551.5C666.2 549.1 668.0 546.6 670.5 545.0C673.5 543.0 677.0 541.7 680.5 540.9C685.1 539.9 689.8 539.6 694.5 539.7C700.2 539.8 705.9 540.4 711.5 541.5C716.6 542.5 721.6 544.0 726.5 545.8C731.0 547.5 735.3 549.6 739.5 552.0C746.0 555.8 751.8 560.7 758.5 564.3C760.0 565.0 761.8 565.0 763.5 564.8C765.2 564.6 767.0 564.0 768.5 563.1C771.1 561.6 773.4 559.6 775.5 557.5C785.4 548.0 795.0 538.2 804.5 528.3C806.5 526.2 808.5 523.9 810.1 521.5C811.0 520.3 811.7 518.9 812.0 517.5C812.4 515.5 812.5 513.5 812.1 511.5C811.7 509.5 810.7 507.7 809.5 506.1C807.4 503.3 805.0 500.8 802.4 498.5C798.0 494.6 793.4 490.9 788.5 487.6C782.4 483.7 776.1 479.9 769.5 477.0C761.1 473.2 752.4 469.9 743.5 467.4C734.3 464.8 724.9 463.0 715.5 461.9C705.2 460.7 694.8 460.3 684.5 460.5C675.5 460.6 666.4 461.5 657.5 463.1C649.4 464.5 641.3 466.6 633.5 469.3C626.6 471.7 619.9 474.8 613.5 478.5C607.5 481.9 602.0 486.1 596.5 490.4C593.8 492.5 591.4 495.0 589.0 497.5C586.2 500.7 583.4 504.0 580.9 507.5C578.9 510.4 577.0 513.4 575.4 516.5C573.8 519.4 572.5 522.4 571.3 525.5C570.3 528.1 569.3 530.8 568.6 533.5C567.6 537.8 566.6 542.1 566.0 546.5C565.5 550.1 565.2 553.8 565.2 557.5C565.1 561.8 565.0 566.2 565.6 570.5C566.5 577.2 567.7 583.9 569.5 590.5C570.4 594.0 571.8 597.3 573.4 600.5C574.9 603.6 576.6 606.6 578.6 609.5C580.7 612.6 583.1 615.7 585.6 618.5C588.1 621.2 590.6 623.9 593.5 626.2C598.7 630.3 604.0 634.2 609.7 637.5C617.1 641.7 624.8 645.5 632.8 648.5C647.8 654.2 663.4 658.2 678.5 663.8C684.0 665.8 689.4 668.3 694.5 671.2C697.1 672.6 699.5 674.4 701.6 676.5C703.2 678.2 704.7 680.3 705.5 682.5C706.2 684.4 706.5 686.5 706.1 688.5C705.5 690.7 704.2 692.8 702.7 694.5C701.0 696.4 698.8 697.8 696.5 698.9C693.7 700.3 690.6 701.3 687.5 702.0C683.9 702.9 680.2 703.6 676.5 703.8C671.3 704.1 666.0 704.2 660.8 703.5C653.2 702.4 645.8 700.5 638.5 698.4C633.7 697.0 629.1 695.1 624.5 693.1C617.7 690.1 611.4 686.0 604.5 683.4C602.3 682.6 599.8 682.6 597.5 682.9C595.9 683.0 594.4 683.7 593.0 684.5C591.0 685.6 589.2 687.1 587.5 688.6C582.0 693.4 576.6 698.4 571.3 703.5C566.4 708.3 561.6 713.3 556.9 718.5C554.7 721.0 552.3 723.5 550.7 726.5C548.4 730.6 547.6 735.3 545.5 739.5C544.9 740.8 543.7 741.8 542.5 742.6C541.3 743.3 539.9 743.6 538.5 743.8C536.5 744.0 534.4 744.3 532.5 743.7C530.0 743.0 527.6 741.8 525.5 740.1C523.6 738.6 522.1 736.6 520.8 734.5C519.5 732.3 518.5 729.9 517.8 727.5C516.6 723.6 515.6 719.6 515.2 715.5C513.9 703.9 512.9 692.2 512.8 680.5C512.0 565.2 512.8 449.8 512.5 334.5C512.5 331.8 512.2 329.1 511.7 326.5C511.3 324.8 510.7 323.0 509.8 321.5C509.0 320.2 507.8 319.0 506.5 318.1C505.0 317.2 503.3 316.5 501.5 316.0C499.5 315.5 497.5 315.3 495.5 315.3C474.2 315.1 452.8 314.9 431.5 315.3C428.8 315.4 426.0 315.7 423.5 316.6C421.4 317.4 419.5 318.8 418.0 320.5C416.7 321.9 416.0 323.8 415.5 325.7C414.8 328.2 414.5 330.9 414.5 333.5C414.2 454.5 415.1 575.5 414.6 696.5C414.5 705.8 414.1 715.2 412.9 724.5C412.3 729.6 411.1 734.7 409.2 739.5C407.6 743.4 405.4 747.2 402.5 750.3C399.4 753.5 395.5 756.0 391.5 758.0C383.1 762.1 374.0 764.5 365.5 768.2C361.4 770.0 357.3 772.1 353.5 774.5C351.5 775.9 349.9 777.7 348.3 779.5C347.2 780.7 346.3 782.1 345.6 783.5C344.7 785.1 343.8 786.7 343.4 788.5C342.8 791.4 342.6 794.5 342.7 797.5C342.8 798.9 343.2 800.2 343.8 801.5C344.9 803.9 346.1 806.4 347.8 808.5C349.7 810.9 352.0 813.0 354.5 814.8C356.8 816.4 359.4 817.5 362.0 818.5C365.4 819.7 368.9 820.8 372.5 821.3C382.4 822.8 392.5 823.2 402.5 824.7C406.6 825.2 410.6 826.2 414.5 827.3C417.4 828.2 420.3 829.2 423.0 830.5C432.6 835.3 441.8 841.0 451.5 845.8C453.7 846.8 456.1 847.5 458.5 847.8C461.0 848.0 463.5 847.9 466.0 847.5Z"
const MARK_BOX = { x: 337, y: 309, w: 532, h: 544 }

// ---------------------------------------------------------------------------------------------
// Timeline, in frames of the 30 fps reference. One reel is 137 frames (4.57 s).

const FPS = 30
const REEL = 137
/** Frames since the burst-in at which the still layout below is exact. */
const REST = 47
/** Period of the cluster-only drift, two reels, so the card loop stays seamless. */
const DRIFT = REEL * 2

interface Stage {
  cluster: boolean
  title: boolean
  markOnly: boolean
  /** Spread of positions around the centre. */
  zoom: number
  /** Vertical spread (collapses a little slower than horizontal). */
  zoomY: number
  /** Size factor for the objects. */
  size: number
  /** Size factor for the centre mark. */
  mark: number
  /** 0 = gradient mark, 1 = white mark. */
  white: number
  /** Frames since the burst-in (drives rotations). */
  since: number
  /** Collapse progress 0..1. */
  collapse: number
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function stageAt(p: number, seq: GlossClusterSequence): Stage {
  if (seq === "cluster") return { cluster: true, title: false, markOnly: false, zoom: 1, zoomY: 1, size: 1, mark: 1, white: 1, since: REST, collapse: 0 }
  const since = p >= 90 ? p - 90 : p + REEL - 90
  const drift = 1 + 0.0018 * (REST - since)
  if (p < 24) {
    const c = Math.min(1, Math.max(0, (p - 15) / 8.5))
    const z = 1 - 0.6 * c * c
    return { cluster: true, title: false, markOnly: false, zoom: z * drift, zoomY: Math.pow(z, 0.50) * drift, size: Math.pow(z, 1.1) * drift, mark: Math.pow(z, 0.40) * drift, white: 1, since, collapse: c }
  }
  if (p < 88) return { cluster: false, title: true, markOnly: false, zoom: 1, zoomY: 1, size: 1, mark: 1, white: 1, since, collapse: 0 }
  if (p < 90) return { cluster: false, title: false, markOnly: true, zoom: 1, zoomY: 1, size: 1, mark: 1.61, white: 0, since, collapse: 0 }
  const q = p - 90
  // Decays that land exactly on 1 when the reel wraps, so the loop has no seam.
  const settle = (fn: (x: number) => number) => fn(q) - (fn(REEL - 90) * q) / (REEL - 90)
  const z = 1 + settle((x) => 1.3 * Math.exp(-x / 4.5) + 0.1 * Math.exp(-x / 15))
  const m = 1 + settle((x) => 0.25 * Math.exp(-x / 3.50) + 0.120 * Math.exp(-x / 10))
  return { cluster: true, title: false, markOnly: false, zoom: z * drift, zoomY: z * drift, size: Math.pow(z, 0.45) * drift, mark: m * drift, white: smooth(8, 42, q), since, collapse: 0 }
}

// ---------------------------------------------------------------------------------------------
// The objects. Positions and radii are measured from the reference still, in units of half the
// frame height of a 16:9 frame (x right, y down). Colour slots index `colors`:
// 0 pink, 1 coral, 2 violet, 3 cobalt, 4 cyan, 5 lime, 6 shadow, 7 white.

const T_MARK = 0, T_SHIELD = 1, T_FLOWER = 2, T_RINGBALL = 3, T_MOLECULE = 4, T_HEADSET = 5, T_HALVES = 6, T_CUBE = 7
const T_CLOVER = 8, T_DUCK = 9, T_CRING = 10, T_BOXBALL = 11, T_PEANUT = 12, T_GLASS = 13, T_STAR = 14, T_DOMES = 15

interface Obj {
  type: number
  /** Centre, px in a 1920x1080 frame. */
  X: number
  Y: number
  /** Radius px in a 1920x1080 frame. */
  R: number
  /** Euler rotation at rest (x, y, z). */
  rot: [number, number, number]
  /** Spin, radians per frame. */
  spin: [number, number, number]
  /** Extra tumble while bursting in. */
  tumble: [number, number, number]
  /** base, light, accent, radial tip, alt material. */
  pal: [number, number, number, number, number]
  /** How much light mixes toward white. */
  lift: number
  /** accent, shadow, radial, marble. */
  k: [number, number, number, number]
  /** Accent direction in screen space (x right, y up). */
  acc: [number, number]
  /** Direction (view space, y up) that falls into shadow. */
  dark: [number, number, number]
  /** Screen direction (y up) the light colour sits on. */
  light: [number, number]
  /** Hotspot: amount, sharpness, pale rim amount, airbrush wobble. */
  hot: [number, number, number, number]
  /** Normal (view space) where the hotspot peaks. */
  hotDir: [number, number, number]
  /** Radial gradient range. */
  rad: [number, number]
  /** Parallax depth 0..1. */
  depth: number
}

const OBJS: Obj[] = [
  { type: T_DOMES, X: 150, Y: 322, R: 215, rot: [0.15, -0.35, 0.3], spin: [0, 0.004, 0.002], tumble: [0, 0.8, 0.4], pal: [2, 2, 5, 3, 6], lift: 0.150, k: [0.5, 0.7, 0.2, 0], acc: [-0.6, -0.80], dark: [0.3, 0.9, 0.3], light: [0.90, -0.10], hot: [0.2, 10, 0.15, 0.35], hotDir: [0.4, 0.3, 1], rad: [0.30, 1.0], depth: 0.70 },
  { type: T_FLOWER, X: 462, Y: 150, R: 245, rot: [0.25, -0.3, 0.16], spin: [0.002, -0.003, 0.003], tumble: [0.6, 0, 0.7], pal: [2, 0, 0, 0, 2], lift: 0.05, k: [0.25, 0.55, 0.75, 0], acc: [0.80, -0.6], dark: [0.2, -0.8, -0.2], light: [-0.4, 0.8], hot: [0.15, 8, 0.1, 0.3], hotDir: [-0.3, 0.5, 1], rad: [0.1, 0.8], depth: 0.50 },
  { type: T_RINGBALL, X: 945, Y: 170, R: 220, rot: [-0.32, 0.1, 0], spin: [0, 0.002, 0], tumble: [0.9, 0.3, 0], pal: [2, 2, 5, 3, 2], lift: 0.080, k: [0.95, 0.8, 0.15, 0], acc: [-0.60, -0.80], dark: [-0.55, 0.8, 0.1], light: [0.9, 0.25], hot: [0.25, 10, 0.1, 0.15], hotDir: [0.5, 0.4, 1], rad: [0.50, 1.00], depth: 0.4 },
  { type: T_MOLECULE, X: 1400, Y: 165, R: 185, rot: [0.1, 0.1, 0], spin: [0, 0.005, 0.002], tumble: [0, 0.6, 0.6], pal: [2, 2, 5, 2, 3], lift: 0.2, k: [0.85, 0.6, 0, 0], acc: [-0.20, -0.980], dark: [-0.5, 0.7, 0], light: [0.8, 0.5], hot: [0.3, 12, 0.1, 0.25], hotDir: [0.4, 0.5, 1], rad: [0, 1], depth: 0.90 },
  { type: T_HEADSET, X: 1655, Y: 392, R: 215, rot: [0.3, -0.5, 0.18], spin: [0, 0.004, 0], tumble: [0.3, 0.9, 0], pal: [3, 2, 5, 3, 3], lift: 0.0, k: [0.3, 0.6, 0, 0], acc: [1, 0.30], dark: [0.1, -0.9, -0.2], light: [-0.7, 0.6], hot: [0.25, 10, 0.1, 0.2], hotDir: [-0.4, 0.5, 1], rad: [0, 1], depth: 0.6 },
  { type: T_HALVES, X: 1228, Y: 372, R: 185, rot: [-0.12, 0.12, 0], spin: [0.003, 0.004, 0.002], tumble: [0.6, 0.6, 0], pal: [1, 0, 2, 1, 7], lift: 0.0, k: [0.3, 0.7, 0, 0.25], acc: [-0.8, -0.4], dark: [0.1, -0.95, -0.1], light: [0.30, 0.6], hot: [0.95, 22, 0.25, 0.3], hotDir: [0.15, 0.2, 1], rad: [0, 1], depth: 0.80 },
  { type: T_CUBE, X: 610, Y: 415, R: 178, rot: [0.12, -0.15, 0.785], spin: [0.002, 0.003, 0.002], tumble: [0.5, 0.7, 0.2], pal: [3, 4, 5, 3, 3], lift: 0.15, k: [0.65, 0.6, 0, 0], acc: [-0.6, 0.8], dark: [0.6, -0.6, 0], light: [-0.5, 0.7], hot: [0.3, 12, 0.1, 0.25], hotDir: [-0.3, 0.4, 1], rad: [0, 1], depth: 0.550 },
  { type: T_SHIELD, X: 195, Y: 715, R: 225, rot: [0.05, 0.15, 0], spin: [0, -0.003, 0.001], tumble: [0.3, 0.8, 0.2], pal: [3, 4, 2, 3, 5], lift: 0.450, k: [0.2, 0.5, 0, 0], acc: [1, -0.20], dark: [0.35, -0.9, -0.2], light: [-0.75, 0.65], hot: [0.15, 5, 0.25, 0.35], hotDir: [-0.6, 0.6, 0.6], rad: [0, 1], depth: 0.450 },
  { type: T_CLOVER, X: 548, Y: 712, R: 112, rot: [0.2, 0.1, 0.3], spin: [0, 0, 0.006], tumble: [0, 0, 1.2], pal: [1, 0, 2, 1, 1], lift: 0.10, k: [0.35, 0.8, 0, 0.85], acc: [-0.70, 0.70], dark: [0, 0, -1], light: [0.30, 0.7], hot: [0.6, 14, 0.3, 0.3], hotDir: [0.2, 0.3, 1], rad: [0, 1], depth: 0.85 },
  { type: T_DUCK, X: 405, Y: 965, R: 185, rot: [0.1, 0.35, -0.12], spin: [0, 0.004, 0], tumble: [0, 0.9, 0.3], pal: [1, 1, 2, 1, 7], lift: 0.180, k: [0.35, 0.65, 0, 0.45], acc: [-0.9, 0.2], dark: [0.4, -0.8, -0.2], light: [-0.3, 0.8], hot: [0.4, 12, 0.3, 0.3], hotDir: [0.2, 0.4, 1], rad: [0, 1], depth: 0.65 },
  { type: T_CRING, X: 838, Y: 905, R: 258, rot: [-0.35, 0.12, 0.785], spin: [0, 0.002, 0.002], tumble: [0.4, 0.4, 0.8], pal: [3, 2, 5, 2, 3], lift: 0.10, k: [0.9, 0.8, 0.25, 0], acc: [0.60, 0.80], dark: [0.55, -0.8, 0], light: [-0.90, -0.2], hot: [0.2, 8, 0.1, 0.35], hotDir: [-0.4, 0.2, 1], rad: [0.50, 1.0], depth: 0.350 },
  { type: T_BOXBALL, X: 1184, Y: 886, R: 72, rot: [0.4, 0.5, 0.1], spin: [0.004, 0.006, 0], tumble: [0.8, 0.8, 0], pal: [3, 2, 5, 3, 2], lift: 0.25, k: [0.85, 0.6, 0, 0], acc: [0.6, -0.80], dark: [-0.5, 0.6, -0.2], light: [0.60, 0.6], hot: [0.6, 14, 0.1, 0.2], hotDir: [0.5, -0.3, 1], rad: [0, 1], depth: 1.0 },
  { type: T_PEANUT, X: 1352, Y: 795, R: 352, rot: [0.0, 0.25, 0.27], spin: [0, 0.004, 0.0015], tumble: [0.3, 0.6, 1.4], pal: [1, 0, 2, 1, 1], lift: 0.050, k: [0.35, 0.85, 0, 0.95], acc: [-0.90, 0.2], dark: [0.1, 0.85, -0.1], light: [-0.3, 0.5], hot: [0.25, 12, 0.45, 0.3], hotDir: [-0.3, 0.4, 1], rad: [0, 1], depth: 0.5 },
  { type: T_GLASS, X: 1555, Y: 702, R: 165, rot: [0.15, -0.3, 0.05], spin: [0, 0.005, 0.002], tumble: [0.4, 0.8, 0], pal: [3, 2, 5, 3, 4], lift: 0.2, k: [0.85, 0.6, 0, 0], acc: [0.850, 0.3], dark: [-0.4, 0.6, -0.2], light: [0.20, 0.8], hot: [0.7, 16, 0.1, 0.2], hotDir: [0.6, -0.1, 1], rad: [0, 1], depth: 0.75 },
  { type: T_STAR, X: 1722, Y: 918, R: 130, rot: [0.25, 0.15, -0.12], spin: [0, 0.004, 0.004], tumble: [0, 0.5, 1.2], pal: [5, 2, 2, 2, 2], lift: 0.1, k: [0.2, 0.4, 1.0, 0], acc: [-0.5, 0.8], dark: [0.3, -0.6, -0.3], light: [-0.50, 0.60], hot: [0.2, 8, 0.1, 0.2], hotDir: [0, 0, 1], rad: [0.050, 0.42], depth: 0.90 },
]
const MARK_OBJ = { X: 955, Y: 537, R: 152 }

// ---------------------------------------------------------------------------------------------
// WebGL

const VERT = `
attribute vec2 aQ;
uniform vec2 uRes, uC;
uniform float uR, uExt;
varying vec2 vP;
void main(){ vec2 px=uC+aQ*uR*uExt; gl_Position=vec4(px/uRes*2.0-1.0,0.0,1.0); vP=aQ*uExt; }
`

const FRAG = `
precision highp float;
varying vec2 vP;
uniform mat3 uInv;
uniform float uType, uPx, uAlpha, uWhite, uSeed;
uniform vec3 uBase, uLight, uAcc, uTip, uAlt, uShadowColor, uHighlightColor, uRimColor;
uniform vec3 uMarkColA, uMarkColB, uMarkColC, uMarkColD, uMarkColE;
uniform vec4 uK;
uniform vec2 uAccDir, uRad, uLightDir;
uniform vec4 uHot;
uniform vec3 uDarkDir, uHotDir;
uniform sampler2D uMark;
float gM;

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,s,-s,c); }
float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
float sdRB(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b+r; return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r; }
float sdTorus(vec3 p, float R, float r){ return length(vec2(length(p.xy)-R,p.z))-r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }
float sdEll(vec3 p, vec3 r){ float k0=length(p/r); float k1=length(p/(r*r)); return k0*(k0-1.0)/max(k1,1e-4); }
float infl(float d2, float z, float T){ return length(vec2(max(d2+T,0.0),z))-T; }
float sdHex(vec2 p, float r){ const vec3 k=vec3(-0.866025404,0.5,0.577350269); p=abs(p); p-=2.0*min(dot(k.xy,p),0.0)*k.xy; p-=vec2(clamp(p.x,-k.z*r,k.z*r),r); return length(p)*sign(p.y); }
float sdVes(vec2 p, float r, float d){ p=abs(p); float b=sqrt(r*r-d*d); return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b)) : length(p-vec2(-d,0.0))-r; }
float sdCTorus(vec3 p, vec2 sc, float ra, float rb){ p.x=abs(p.x); float k=(sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy); return sqrt(max(dot(p,p)+ra*ra-2.0*ra*k,0.0))-rb; }
float sdStar4(vec2 p, float r, float m){
  float an=3.141593/4.0; float en=3.141593/m;
  vec2 acs=vec2(cos(an),sin(an)); vec2 ecs=vec2(cos(en),sin(en));
  float bn=mod(atan(p.x,p.y),2.0*an)-an;
  p=length(p)*vec2(cos(bn),abs(sin(bn)));
  p-=r*acs; p+=ecs*clamp(-dot(p,ecs),0.0,r*acs.y/ecs.y);
  return length(p)*sign(p.x);
}
float sdFrame(vec3 p, vec3 b, float e){
  p=abs(p)-b; vec3 q=abs(p+e)-e;
  return min(min(
    length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
    length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
    length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}
// Rounded shield badge (sloped top, soft point at the bottom): a smooth max of its seven edge
// half-planes, so every inner contour is rounded and the inflated surface has no creases.
float hp(vec2 p, vec3 e){ return exp((dot(p,e.xy)-e.z)/0.075); }
float sdShield(vec2 p){
  float s=hp(p,vec3(0.1428,0.9897,0.904))+hp(p,vec3(0.7692,0.639,0.8342))+hp(p,vec3(0.9522,-0.3056,0.8023))
    +hp(p,vec3(0.4771,-0.8789,0.8374))+hp(p,vec3(-0.3341,-0.9425,0.9404))+hp(p,vec3(-0.9899,-0.1414,0.9306))+hp(p,vec3(-0.8844,0.4668,0.9974));
  return 0.075*log(s)*0.95;
}
float h3(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
  vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1.0,0.0,0.0)),f.x),mix(h3(i+vec3(0.0,1.0,0.0)),h3(i+vec3(1.0,1.0,0.0)),f.x),f.y),
             mix(mix(h3(i+vec3(0.0,0.0,1.0)),h3(i+vec3(1.0,0.0,1.0)),f.x),mix(h3(i+vec3(0.0,1.0,1.0)),h3(i+vec3(1.0,1.0,1.0)),f.x),f.y),f.z);
}

float map(vec3 p){
  gM=0.0;
  float t=uType;
  if(t<1.5){ // shield badge with a check
    float d=infl(sdShield(p.xy),p.z,0.4);
    vec3 c=p-vec3(0.0,0.0,0.37);
    float ck=min(sdCap(c,vec3(-0.42,0.1,0.0),vec3(-0.35,-0.2,0.0),0.085),sdCap(c,vec3(-0.35,-0.2,0.0),vec3(0.3,0.03,0.0),0.085));
    if(ck<d) gM=1.0;
    return min(d,ck);
  }
  if(t<2.5){ // four-petal flower
    vec2 q=rot(0.785398)*p.xy; q=abs(q); if(q.y>q.x) q=q.yx;
    float d2=sdVes(vec2(q.y,q.x-0.5),0.725,0.525);
    return infl(d2,p.z,0.08);
  }
  if(t<3.5){ // thick ring with a ball
    float d=sdTorus(p,0.74,0.26);
    float b=length(p-vec3(0.0,0.0,-0.02))-0.31;
    if(b<d) gM=1.0;
    return min(d,b);
  }
  if(t<4.5){ // stacked spheres on sticks
    vec3 a=vec3(-0.054,0.676,-0.1), b=vec3(-0.757,0.108,0.0), c=vec3(0.73,0.27,-0.05), e=vec3(0.081,-0.649,0.1);
    float s=min(min(length(p-a),length(p-b)),min(length(p-c),length(p-e)))-0.29;
    float st=min(min(sdCap(p,e,a,0.02),sdCap(p,e,b,0.02)),sdCap(p,e,c,0.02));
    if(st<s) gM=1.0;
    return min(s,st);
  }
  if(t<5.5){ // visor helmet with goggles
    float shell=sdEll(p-vec3(0.05,0.08,-0.05),vec3(0.78,0.72,0.74));
    float chin=sdRB(p-vec3(-0.02,-0.38,0.12),vec3(0.6,0.28,0.55),0.25);
    float body=smin(shell,chin,0.15);
    float vis=sdRB(p-vec3(-0.1,-0.1,0.72),vec3(0.52,0.38,0.42),0.18);
    float d=max(body,-vis);
    if(-vis>body-0.002) gM=2.0;
    float eyes=min(sdCap(p,vec3(-0.32,-0.24,0.36),vec3(-0.3,-0.06,0.36),0.05),sdCap(p,vec3(-0.13,-0.24,0.38),vec3(-0.11,-0.06,0.38),0.05));
    if(eyes<d){ d=eyes; gM=1.0; }
    vec3 g=p-vec3(-0.1,0.55,0.36); g.yz=rot(-0.35)*g.yz;
    float gog=max(sdRB(g,vec3(0.44,0.27,0.1),0.12),-sdRB(g,vec3(0.29,0.13,0.3),0.08));
    if(gog<d){ d=gog; gM=0.0; }
    vec3 e2=p-vec3(0.68,-0.28,-0.05);
    vec2 dd=vec2(length(e2.yz)-0.2,abs(e2.x)-0.09);
    float cup=length(max(dd,0.0))+min(max(dd.x,dd.y),0.0)-0.06;
    if(cup<d){ d=cup; gM=0.0; }
    return d;
  }
  if(t<6.5){ // two domed half spheres split on a diagonal
    // Two lens-like half discs with the same heading, stacked like slices across the cut line.
    vec3 a=vec3(rot(0.87)*(p.xy-vec2(-0.25,-0.21)),p.z), b=vec3(rot(0.87)*(p.xy-vec2(0.25,0.21)),p.z+0.06);
    float sa=sdEll(a,vec3(0.52,0.52,0.24)), sb=sdEll(b,vec3(0.52,0.52,0.24));
    float h1=max(sa,a.y), h2=max(sb,b.y);
    float d=min(h1,h2);
    if((h1<h2 && a.y>sa) || (h2<=h1 && b.y>sb)) gM=1.0;
    return d;
  }
  if(t<7.5){ // cube with a dimple, a ring and a ball
    float bx=sdRB(p,vec3(0.62,0.62,0.3),0.1);
    float dim=length(p-vec3(0.0,0.0,0.75))-0.6;
    float d=max(bx,-dim);
    float rg=sdTorus(p-vec3(0.0,0.0,0.2),0.42,0.07);
    float bl=length(p-vec3(-0.04,-0.04,0.12))-0.32;
    float a=min(rg,bl);
    if(a<d) gM=1.0;
    return min(d,a);
  }
  if(t<8.5){ // clover of four balls
    vec2 q=abs(p.xy); if(q.y>q.x) q=q.yx;
    return length(vec3(q-vec2(0.47,0.0),p.z*1.1))-0.45;
  }
  if(t<9.5){ // duck
    float body=sdEll(p-vec3(-0.05,-0.38,0.0),vec3(0.78,0.48,0.55));
    float head=length(p-vec3(0.18,0.3,0.05))-0.42;
    float tail=sdEll(p-vec3(-0.72,-0.1,0.0),vec3(0.2,0.26,0.2));
    float d=smin(smin(body,head,0.18),tail,0.12);
    float beak=sdEll(p-vec3(0.55,0.17,0.22),vec3(0.28,0.09,0.2));
    float eye=length(p-vec3(0.33,0.43,0.33))-0.08;
    if(beak<d){ d=beak; gM=1.0; }
    if(eye<d){ d=eye; gM=2.0; }
    return d;
  }
  if(t<10.5){ // ring with a gap
    return sdCTorus(p,vec2(sin(2.6),cos(2.6)),0.72,0.28);
  }
  if(t<11.5){ // small ball in a wire box
    float s=length(p)-0.6;
    float f=sdFrame(p,vec3(0.85),0.014);
    if(f<s) gM=1.0;
    return min(s,f);
  }
  if(t<12.5){ // bowling-pin peanut
    return smin(length(p-vec3(0.0,0.5,0.0))-0.37,length(p-vec3(0.0,-0.5,0.0))-0.39,0.52);
  }
  if(t<13.5){ // ball behind a glass tile
    float s=length(p-vec3(0.18,0.3,-0.1))-0.5;
    vec3 g=p-vec3(-0.1,-0.18,0.3); g.xy=rot(-0.25)*g.xy;
    float tl=sdRB(g,vec3(0.5,0.54,0.035),0.03);
    if(tl<s) gM=1.0;
    return min(s,tl);
  }
  if(t<14.5){ // four-point sparkle star
    return infl(sdStar4(p.xy,1.0,3.2),p.z,0.08);
  }
  // nested half domes
  vec3 n=normalize(vec3(1.0,0.3,-0.65));
  vec3 a=p-vec3(-0.18,0.06,0.0), b=p-vec3(0.42,-0.12,0.0), c=p-vec3(0.72,-0.22,0.0);
  float sa=length(a)-0.78, sb=length(b)-0.34, sc=length(c)-0.16;
  float pa=dot(a,n), pb=dot(b,n), pc=dot(c,n);
  float da=max(sa,pa), db=max(sb,pb), dc=max(sc,pc);
  float d=min(da,min(db,dc));
  if((d==da && pa>sa) || (d==db && pb>sb) || (d==dc && pc>sc)) gM=2.0;
  return d;
}

vec3 calcN(vec3 p){
  vec2 e=vec2(0.0015,-0.0015);
  return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));
}

vec3 shade(vec3 n, vec3 op, float mat){
  // Airbrush: a slow wobble of the normal used for the gradient lookup, so bands bloom and blotch.
  vec3 w=vec3(noise(op*1.6+uSeed),noise(op*1.6+uSeed+3.1),noise(op*1.6+uSeed+5.7))-0.5;
  vec3 m=normalize(n+w*uHot.w);
  float rim=1.0-max(n.z,0.0);
  float sp=pow(max(dot(n,normalize(uHotDir)),0.0),uHot.y);
  vec2 ld=normalize(uLightDir), adr=normalize(uAccDir);
  vec3 base=uBase, lt=uLight, ac=uAcc;
  if(mat>1.5){
    vec3 c=mix(uShadowColor*0.7,uBase*0.32,smoothstep(-0.4,0.9,dot(m,normalize(vec3(ld,0.4)))));
    return c+uHighlightColor*sp*0.2;
  }
  if(mat>0.5){ base=uAlt; lt=mix(uAlt,uHighlightColor,0.3); }
  base=mix(base,uTip,smoothstep(uRad.x,uRad.y,length(op.xy))*uK.z);
  float mb=noise(op*2.2+uSeed);
  base=mix(base,uLight,smoothstep(0.45,0.8,mb)*uK.w*0.8);
  float kL=dot(m,normalize(vec3(ld,0.2)))+0.35*dot(op.xy,ld);
  vec3 col=mix(base,lt,smoothstep(0.0,0.95,kL));
  float kA=dot(m,normalize(vec3(adr,0.25)))+0.45*dot(op.xy,adr);
  col=mix(col,ac,smoothstep(0.0,0.8,kA)*uK.x);
  vec3 dd=normalize(uDarkDir);
  float dk=smoothstep(-0.05,0.8,dot(m,dd)+0.25*dot(op.xy,dd.xy));
  float mb2=noise(op*1.7+uSeed+7.3);
  dk=max(dk,smoothstep(0.55,0.85,mb2)*uK.w);
  col=mix(col,uShadowColor,min(1.0,dk*uK.y));
  col=mix(col,mix(lt,uHighlightColor,0.6),pow(rim,2.5)*uHot.z);
  col=mix(col,uHighlightColor,sp*uHot.x);
  return col;
}

vec3 markGrad(vec2 q){
  float a=atan(q.y,q.x);
  vec3 acc=vec3(0.0); float ws=0.0; float w;
  w=exp(3.5*cos(a-1.57)); acc+=uMarkColA*w; ws+=w;
  w=exp(3.5*cos(a-0.35)); acc+=uMarkColB*w; ws+=w;
  w=exp(3.5*cos(a+0.9)); acc+=uMarkColC*w; ws+=w;
  w=exp(3.5*cos(a+2.0)); acc+=uMarkColD*w; ws+=w;
  w=exp(3.5*cos(a-2.6)); acc+=uMarkColE*w; ws+=w;
  return acc/ws;
}

void main(){
  if(uType<0.5){
    float r=length(vP);
    float a=1.0-smoothstep(1.0-uPx,1.0+uPx,r);
    vec2 uv=vec2(vP.x*0.5+0.5,0.5-vP.y*0.5);
    float m=texture2D(uMark,uv).a;
    a*=1.0-m;
    if(a<0.003) discard;
    vec2 g=vP;
    float shadeR=smoothstep(0.35,1.0,r);
    vec3 white=mix(uHighlightColor,uRimColor,shadeR*smoothstep(-0.6,0.9,dot(normalize(g+1e-4),vec2(0.7,-0.7)))*0.7);
    vec3 grad=markGrad(g)*(0.85+0.25*smoothstep(1.0,0.3,r));
    vec3 col=mix(grad,white,uWhite);
    gl_FragColor=vec4(col*a*uAlpha,a*uAlpha);
    return;
  }
  vec3 ro=uInv*vec3(vP,2.5);
  vec3 rd=uInv*vec3(0.0,0.0,-1.0);
  float t=0.0, dB=1e3, tB=0.0; bool hit=false;
  for(int i=0;i<72;i++){
    vec3 p=ro+rd*t;
    float d=map(p);
    if(d<dB){ dB=d; tB=t; }
    if(d<uPx*0.2){ hit=true; tB=t; break; }
    t+=d*0.9;
    if(t>5.0) break;
  }
  float a=hit?1.0:1.0-smoothstep(0.0,uPx*1.2,dB);
  if(a<0.003) discard;
  vec3 p=ro+rd*tB;
  vec3 n=calcN(p);
  float ao=clamp(map(p+n*0.14)/0.14,0.0,1.0);
  map(p);
  float mat=gM;
  vec3 nv=normalize(n*uInv);
  vec3 col=shade(nv,p,mat)*mix(0.25,1.0,ao);
  float ga=1.0;
  if(uType>12.5 && uType<13.5 && mat>0.5 && mat<1.5){
    // See-through glass tile: bend the ray, look for the ball behind it, tint, frost and a caustic arc.
    vec3 g=p-vec3(-0.1,-0.18,0.3); g.xy=rot(-0.25)*g.xy;
    vec2 uv=g.xy/vec2(0.5,0.54);
    vec3 rr=normalize(rd-n*0.35);
    vec3 c0=vec3(0.18,0.3,-0.1); vec3 oc=p-c0;
    float bq=dot(oc,rr), hq=bq*bq-(dot(oc,oc)-0.25);
    vec3 behind=vec3(0.0); float ba=0.0;
    if(hq>0.0){ float tt=-bq-sqrt(hq); if(tt>0.0){ vec3 hp=p+rr*tt; behind=shade(normalize(normalize(hp-c0)*uInv),hp,0.0); ba=1.0; } }
    vec3 gc=mix(uBase*0.18+uShadowColor*0.55,behind*0.62+uBase*0.08,ba);
    float frost=smoothstep(0.35,1.45,-0.55*uv.x-0.8*uv.y);
    gc=mix(gc,uHighlightColor,frost*0.85);
    gc+=uAcc*exp(-pow((length(uv-vec2(0.55,0.75))-1.3)*5.0,2.0))*0.75;
    gc=mix(gc,mix(uAlt,uHighlightColor,0.4),smoothstep(0.84,1.0,max(abs(uv.x),abs(uv.y)))*0.55);
    col=gc; ga=mix(0.72,1.0,max(ba,frost));
  }
  gl_FragColor=vec4(col*a*ga*uAlpha,a*ga*uAlpha);
}
`

interface GLKit {
  gl: WebGLRenderingContext
  prog: WebGLProgram
  u: Record<string, WebGLUniformLocation | null>
  tex: WebGLTexture
}

function compileGL(gl: WebGLRenderingContext, markCanvas: HTMLCanvasElement): GLKit {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader")
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link")
  gl.useProgram(prog)
  const names = ["uRes", "uC", "uR", "uExt", "uInv", "uType", "uPx", "uAlpha", "uWhite", "uSeed", "uBase", "uLight", "uAcc", "uTip", "uAlt", "uShadowColor", "uHighlightColor", "uRimColor", "uMarkColA", "uMarkColB", "uMarkColC", "uMarkColD", "uMarkColE", "uK", "uAccDir", "uRad", "uHot", "uDarkDir", "uLightDir", "uHotDir", "uMark"]
  const u: Record<string, WebGLUniformLocation | null> = {}
  for (const n of names) u[n] = gl.getUniformLocation(prog, n)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, "aQ")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  const tex = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, markCanvas)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.uniform1i(u.uMark, 0)
  return { gl, prog, u, tex }
}

/** Mark silhouette (alpha) inside the unit disc, 512 px square. */
function makeMarkCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = c.height = 512
  const x = c.getContext("2d")
  if (x) {
    const s = (0.6 * 512) / MARK_BOX.h
    x.translate(256 - (MARK_BOX.w * s) / 2 + 6, 256 - (MARK_BOX.h * s) / 2 + 14)
    x.scale(s, s)
    x.translate(-MARK_BOX.x, -MARK_BOX.y)
    x.fillStyle = "#ffffff" // ls:keep
    x.fill(new Path2D(MARK_PATH))
  }
  return c
}

// ---------------------------------------------------------------------------------------------
// Maths

type M3 = number[]

function euler(rx: number, ry: number, rz: number): M3 {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz)
  // M = Rz * Ry * Rx, row-major
  return [
    cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx,
    sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx,
    -sy, cy * sx, cy * cx,
  ]
}

function parseColor(c: string, probe: CanvasRenderingContext2D | null): [number, number, number] {
  let s = c
  if (probe) {
    probe.fillStyle = "#000000" // ls:keep
    probe.fillStyle = c
    s = String(probe.fillStyle)
  }
  if (s[0] === "#") {
    const h = s.length === 4 ? s.slice(1).split("").map((v) => v + v).join("") : s.slice(1, 7)
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]
  }
  const m = s.match(/[\d.]+/g)
  if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255]
  return [1, 1, 1]
}

const mix3 = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const toCss = (c: number[]) => `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)})`

// ---------------------------------------------------------------------------------------------
// Title card

/** Slot-reel position of each digit at reel frame p: [glyph value, fraction rolled]. */
function reelDigits(num: string, p: number): { a: number; b: number; f: number }[] | null {
  if (!/^\d+$/.test(num)) return null
  const out: { a: number; b: number; f: number }[] = []
  const last = num.length - 1
  for (let i = 0; i < num.length; i++) {
    const target = +num[i]
    const steps = i === last ? 5 : 1
    let r: number
    if (i === last) {
      const u = Math.min(1, Math.max(0, (p - 24.50) / 37))
      r = steps * (1 - Math.pow(1 - u, 2))
    } else r = steps * smooth(27, 45, p - (last - 1 - i) * 3)
    const v = target - steps + r
    const a = Math.floor(v + 1e-6)
    out.push({ a: ((a % 10) + 10) % 10, b: (((a + 1) % 10) + 10) % 10, f: v - a })
  }
  return out
}

function drawTitle(
  ctx: CanvasRenderingContext2D, W: number, H: number, p: number,
  word: string, num: string, font: string, textColor: string, numberColor: string,
) {
  const unit = Math.sqrt(W * H)
  let cap = 0.05430 * unit
  const cond = 0.60
  const scale = 1 + 0.280 * Math.exp(-(p - 24) / 5)
  const measure = (c: number) => {
    ctx.font = `800 ${c / 0.72}px ${font}`
    const ww = ctx.measureText(word).width * cond + c * 0.06
    ctx.font = `400 ${c / 0.72}px ${font}`
    const dw = ctx.measureText("0").width
    return { ww, dw }
  }
  let m = measure(cap)
  let total = m.ww + cap * 0.140 + m.dw * num.length
  if (total > W * 0.820) {
    cap *= (W * 0.820) / total
    m = measure(cap)
    total = m.ww + cap * 0.140 + m.dw * num.length
  }
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.scale(scale, scale)
  const x0 = -total / 2
  const base = cap / 2
  // wordmark: heavy, condensed, thickened a touch with a stroke
  ctx.save()
  ctx.translate(x0, base)
  ctx.scale(cond, 1)
  ctx.font = `800 ${cap / 0.72}px ${font}`
  ctx.fillStyle = textColor
  ctx.strokeStyle = textColor
  ctx.lineWidth = cap * 0.07
  ctx.lineJoin = "round"
  ctx.textBaseline = "alphabetic"
  ctx.fillText(word, cap * 0.05, 0)
  ctx.strokeText(word, cap * 0.05, 0)
  ctx.restore()
  // number on slot reels
  ctx.font = `400 ${cap / 0.72}px ${font}`
  ctx.fillStyle = numberColor
  ctx.textBaseline = "alphabetic"
  let x = x0 + m.ww + cap * 0.140
  const reels = reelDigits(num, p)
  const pitch = cap * 1.22
  const top = base - cap * 1.08, bottom = base + cap * 0.1
  for (let i = 0; i < num.length; i++) {
    if (!reels) {
      ctx.fillText(num[i], x, base)
    } else {
      const r = reels[i]
      ctx.save()
      ctx.beginPath()
      ctx.rect(x - cap * 0.10, top, m.dw + cap * 0.20, bottom - top)
      ctx.clip()
      const off = r.f * pitch
      ctx.fillText(String(r.a), x, base - off)
      if (r.f > 0.001) ctx.fillText(String(r.b), x, base - off + pitch)
      ctx.restore()
    }
    x += m.dw
  }
  ctx.restore()
}

// ---------------------------------------------------------------------------------------------
// Canvas 2D fallback silhouettes (unit space, y down).

function fallbackPath(type: number): Path2D {
  const p = new Path2D()
  const circ = (x: number, y: number, r: number) => { p.moveTo(x + r, y); p.arc(x, y, r, 0, Math.PI * 2) }
  switch (type) {
    case T_SHIELD: {
      for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; const f = i ? "lineTo" : "moveTo"; p[f](Math.cos(a) * 0.95, Math.sin(a) * 0.950) }
      p.closePath(); break
    }
    case T_FLOWER: for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + (i * Math.PI) / 2; p.moveTo(0, 0); p.ellipse(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.5, 0.150, a, 0, Math.PI * 2) } break
    case T_RINGBALL: case T_CRING: p.arc(0, 0, 0.970, 0, Math.PI * 2); p.moveTo(0.30, 0); p.arc(0, 0, 0.30, 0, Math.PI * 2, true); if (type === T_RINGBALL) circ(0, 0, 0.3); break
    case T_MOLECULE: circ(-0.05, -0.680, 0.29); circ(-0.760, -0.110, 0.290); circ(0.730, -0.27, 0.29); circ(0.08, 0.65, 0.290); break
    case T_HALVES: p.moveTo(-0.6, 0); p.arc(-0.1, 0.05, 0.5, 0, Math.PI); p.moveTo(0.6, 0); p.arc(0.1, -0.050, 0.5, Math.PI, Math.PI * 2); break
    case T_CLOVER: circ(0.450, 0, 0.45); circ(-0.450, 0, 0.450); circ(0, 0.450, 0.45); circ(0, -0.45, 0.45); break
    case T_PEANUT: circ(0, -0.5, 0.37); circ(0, 0.50, 0.39); p.rect(-0.15, -0.50, 0.3, 1); break
    case T_STAR: for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2; const r = i % 2 ? 0.220 : 1; const f = i ? "lineTo" : "moveTo"; p[f](Math.cos(a) * r, Math.sin(a) * r) } p.closePath(); break
    case T_CUBE: p.rect(-0.62, -0.62, 1.240, 1.24); break
    default: circ(0, 0, 0.8)
  }
  return p
}

// ---------------------------------------------------------------------------------------------

interface Live {
  speed: number
  interactive: boolean
  sequence: GlossClusterSequence
  word: string
  num: string
  font: string
  textColor: string
  numberColor: string
}

interface Body { ox: number; oy: number; vx: number; vy: number; s: number; vs: number }

export function GlossCluster({
  colors = DEFAULT_COLORS,
  background = "#000000",
  wordmark = "LOUIS STUDIOS",
  number = 15,
  textColor = "#ffffff",
  numberColor = "#a4a4a6",
  font = "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
  sequence = "full",
  speed = 1,
  interactive = true,
  ariaLabel = "Cluster of glossy 3D icons around the Louis Studios mark",
  className,
  style,
}: GlossClusterProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const glRef = React.useRef<HTMLCanvasElement>(null)
  const topRef = React.useRef<HTMLCanvasElement>(null)
  const live = React.useRef<Live>({ speed, interactive, sequence, word: wordmark, num: String(number), font, textColor, numberColor })
  live.current = { speed, interactive, sequence, word: wordmark, num: String(number), font, textColor, numberColor }
  const colorKey = JSON.stringify(colors)
  const redraw = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    const root = rootRef.current
    const glCanvas = glRef.current
    const top = topRef.current
    if (!root || !glCanvas || !top) return
    const ctx = top.getContext("2d")
    const probe = document.createElement("canvas").getContext("2d")
    const list: string[] = JSON.parse(colorKey)
    const pal = DEFAULT_COLORS.map((d, i) => parseColor(list[i] || d, probe))
    const shadow = parseColor(SHADOW_COLOR, probe)
    const hi = parseColor(HIGHLIGHT_COLOR, probe)
    const rimc = parseColor(MARK_RIM_COLOR, probe)
    const slot = (i: number) => (i === 6 ? shadow : i === 7 ? hi : pal[i])

    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null
    let reduced = !!mq?.matches

    let kit: GLKit | null = null
    try {
      const gl = glCanvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null
      if (gl) kit = compileGL(gl, makeMarkCanvas())
    } catch {
      kit = null
    }
    const markPath = new Path2D(MARK_PATH)
    const fbPaths = OBJS.map((o) => fallbackPath(o.type))

    let W = 1, H = 1, dpr = 1
    const resize = () => {
      const r = root.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, Math.round(r.width * dpr))
      H = Math.max(1, Math.round(r.height * dpr))
      for (const c of [glCanvas, top]) if (c.width !== W || c.height !== H) { c.width = W; c.height = H }
      draw()
    }

    // Interaction state
    const bodies: Body[] = OBJS.map(() => ({ ox: 0, oy: 0, vx: 0, vy: 0, s: 1, vs: 0 }))
    const markBody: Body = { ox: 0, oy: 0, vx: 0, vy: 0, s: 1, vs: 0 }
    let px = 0, py = 0, pin = false, par = [0, 0], parT = [0, 0]

    let clock = 0 // reference frames
    let last = performance.now()

    const layout = () => {
      // 16:9 is the reference framing. Squarer boxes scale the cluster down a touch and stretch it
      // vertically, so the density matches the reference and the outer objects crop at the edges.
      const us = Math.sqrt(W * H) / 2.6667
      const t = Math.min(1, Math.max(0, (1.77780 - W / H) / 0.77780))
      const sz = us * (1 - 0.0930 * t)
      return { ux: sz, uy: sz * (1 + 0.220 * t), sz }
    }

    const objectFrame = (i: number, st: Stage, seq: GlossClusterSequence) => {
      const o = OBJS[i]
      const L = layout()
      const x = (o.X - 960) / 540, y = (o.Y - 540) / 540
      let rx = o.rot[0], ry = o.rot[1], rz = o.rot[2]
      let bx = 0, by = 0
      if (seq === "cluster") {
        const w = (2 * Math.PI) / DRIFT
        const s = Math.sin(clock * w + i), amp = 1 / w
        rx += o.spin[0] * amp * s; ry += o.spin[1] * amp * s; rz += o.spin[2] * amp * Math.sin(clock * w + i * 0.7)
        bx = 0.0180 * Math.sin(clock * w * 2 + i * 1.7)
        by = 0.018 * Math.cos(clock * w + i * 2.30)
      } else {
        const d = st.since - REST
        rx += o.spin[0] * d; ry += o.spin[1] * d; rz += o.spin[2] * d
        const fly = st.since < REEL - 90 ? Math.exp(-st.since / 7) - (Math.exp(-(REEL - 90) / 7) * st.since) / (REEL - 90) : 0
        rx += o.tumble[0] * fly; ry += o.tumble[1] * fly; rz += o.tumble[2] * fly
        // Objects start turning well before the collapse, as in the reference (from about frame 5).
        const pre = smooth(52, 71, st.since)
        rx += o.tumble[1] * 0.550 * pre; ry += o.tumble[0] * 0.50 * pre; rz -= o.tumble[2] * 0.60 * pre
        if (o.type === T_RINGBALL) rx -= 0.88 * smooth(50, 68, st.since)
        bx = 0.012 * Math.sin((st.since / REEL) * 2 * Math.PI + i)
        by = 0.012 * Math.cos((st.since / REEL) * 2 * Math.PI + i * 1.3)
      }
      const b = bodies[i]
      const cx = W / 2 + (x + bx) * st.zoom * L.ux + b.ox + par[0] * o.depth
      const cy = H / 2 + (y + by) * st.zoomY * L.uy + b.oy + par[1] * o.depth
      const R = (o.R / 540) * L.sz * st.size * b.s
      return { cx, cy, R, m: euler(rx, ry, rz) }
    }

    const markFrame = (st: Stage) => {
      const L = layout()
      const cx = W / 2 + ((MARK_OBJ.X - 960) / 540) * L.ux * st.zoom + markBody.ox + par[0] * 0.20
      const cy = H / 2 + ((MARK_OBJ.Y - 540) / 540) * L.uy * st.zoomY + markBody.oy + par[1] * 0.2
      const R = (MARK_OBJ.R / 540) * L.sz * st.mark * markBody.s
      return { cx, cy, R }
    }

    const reelPhase = () => ((((clock + 1e-4) % REEL) + REEL) % REEL)

    const drawGL = (st: Stage) => {
      if (!kit) return
      const { gl, u } = kit
      gl.viewport(0, 0, W, H)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.uRes, W, H)
      gl.uniform3fv(u.uShadowColor, shadow)
      gl.uniform3fv(u.uHighlightColor, hi)
      gl.uniform3fv(u.uRimColor, rimc)
      gl.uniform3fv(u.uMarkColA, pal[0])
      gl.uniform3fv(u.uMarkColB, pal[4])
      gl.uniform3fv(u.uMarkColC, pal[4])
      gl.uniform3fv(u.uMarkColD, pal[2])
      gl.uniform3fv(u.uMarkColE, pal[3])
      gl.uniform1f(u.uAlpha, 1)
      const seq = live.current.sequence
      if (st.cluster) {
        for (let i = 0; i < OBJS.length; i++) {
          const o = OBJS[i]
          const f = objectFrame(i, st, seq)
          if (f.cx + f.R * 1.4 < 0 || f.cx - f.R * 1.4 > W || f.cy + f.R * 1.4 < 0 || f.cy - f.R * 1.4 > H) continue
          gl.uniform2f(u.uC, f.cx, H - f.cy)
          gl.uniform1f(u.uR, f.R)
          gl.uniform1f(u.uExt, 1.32)
          gl.uniformMatrix3fv(u.uInv, false, f.m)
          gl.uniform1f(u.uType, o.type)
          gl.uniform1f(u.uPx, 1 / Math.max(f.R, 1))
          gl.uniform1f(u.uSeed, i * 3.70)
          gl.uniform3fv(u.uBase, slot(o.pal[0]))
          gl.uniform3fv(u.uLight, mix3(slot(o.pal[1]), hi, o.lift))
          gl.uniform3fv(u.uAcc, slot(o.pal[2]))
          gl.uniform3fv(u.uTip, slot(o.pal[3]))
          gl.uniform3fv(u.uAlt, slot(o.pal[4]))
          gl.uniform4f(u.uK, o.k[0], o.k[1], o.k[2], o.k[3])
          const al = Math.hypot(o.acc[0], o.acc[1]) || 1
          gl.uniform2f(u.uAccDir, o.acc[0] / al, o.acc[1] / al)
          gl.uniform2f(u.uRad, o.rad[0], o.rad[1])
          gl.uniform4f(u.uHot, o.hot[0], o.hot[1], o.hot[2], o.hot[3])
          gl.uniform2f(u.uLightDir, o.light[0], o.light[1])
          gl.uniform3f(u.uHotDir, o.hotDir[0], o.hotDir[1], o.hotDir[2])
          gl.uniform3f(u.uDarkDir, o.dark[0], o.dark[1], o.dark[2])
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }
      }
      if (st.cluster || st.markOnly) {
        const f = markFrame(st)
        gl.uniform2f(u.uC, f.cx, H - f.cy)
        gl.uniform1f(u.uR, f.R)
        gl.uniform1f(u.uExt, 1.02)
        gl.uniform1f(u.uType, T_MARK)
        gl.uniform1f(u.uPx, 1.20 / Math.max(f.R, 1))
        gl.uniform1f(u.uWhite, st.white)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
    }

    const drawFallback = (st: Stage) => {
      if (!ctx) return
      const seq = live.current.sequence
      if (st.cluster) {
        for (let i = 0; i < OBJS.length; i++) {
          const o = OBJS[i]
          const f = objectFrame(i, st, seq)
          const base = slot(o.pal[0]), lt = mix3(slot(o.pal[1]), hi, o.lift), ac = slot(o.pal[2])
          ctx.save()
          ctx.translate(f.cx, f.cy)
          ctx.rotate(-Math.atan2(f.m[3], f.m[0]))
          ctx.scale(f.R, f.R)
          const g = ctx.createLinearGradient(-o.acc[0], o.acc[1], o.acc[0], -o.acc[1])
          g.addColorStop(0, toCss(base))
          g.addColorStop(0.550, toCss(base))
          g.addColorStop(1, toCss(ac))
          ctx.fillStyle = g
          ctx.fill(fbPaths[i], "evenodd")
          const h = ctx.createRadialGradient(-0.35, -0.40, 0, -0.350, -0.4, 0.9)
          h.addColorStop(0, toCss(lt))
          h.addColorStop(1, "rgba(0, 0, 0, 0)") // ls:keep
          ctx.fillStyle = h
          ctx.fill(fbPaths[i], "evenodd")
          ctx.restore()
        }
      }
      if (st.cluster || st.markOnly) {
        const f = markFrame(st)
        ctx.save()
        ctx.translate(f.cx, f.cy)
        ctx.beginPath()
        ctx.arc(0, 0, f.R, 0, Math.PI * 2)
        if (st.white > 0.5) ctx.fillStyle = toCss(hi)
        else {
          const g = ctx.createLinearGradient(-f.R, -f.R, f.R, f.R)
          g.addColorStop(0, toCss(pal[0]))
          g.addColorStop(0.5, toCss(pal[2]))
          g.addColorStop(1, toCss(pal[4]))
          ctx.fillStyle = g
        }
        ctx.fill()
        const s = (0.6 * 2 * f.R) / MARK_BOX.h
        ctx.translate(-(MARK_BOX.w * s) / 2 + f.R * 0.0230, -(MARK_BOX.h * s) / 2 + f.R * 0.055)
        ctx.scale(s, s)
        ctx.translate(-MARK_BOX.x, -MARK_BOX.y)
        ctx.globalCompositeOperation = "destination-out"
        ctx.fill(markPath)
        ctx.restore()
      }
    }

    function draw() {
      const lv = live.current
      const p = lv.sequence === "cluster" ? 0 : reelPhase()
      const st = stageAt(p, lv.sequence)
      if (ctx) ctx.clearRect(0, 0, W, H)
      if (kit) drawGL(st)
      else drawFallback(st)
      if (st.title && ctx) drawTitle(ctx, W, H, p, lv.word, lv.num, lv.font, lv.textColor, lv.numberColor)
    }

    // Physics for the pointer and clicks
    const step = (dt: number) => {
      const lv = live.current
      const L = layout()
      parT = lv.interactive && pin ? [-(px - W / 2) / W * 0.05 * W, -(py - H / 2) / H * 0.050 * H] : [0, 0]
      par[0] += (parT[0] - par[0]) * Math.min(1, dt * 4)
      par[1] += (parT[1] - par[1]) * Math.min(1, dt * 4)
      const p = lv.sequence === "cluster" ? 0 : reelPhase()
      const st = stageAt(p, lv.sequence)
      const all = [...bodies, markBody]
      for (let i = 0; i < all.length; i++) {
        const b = all[i]
        let tx = 0, ty = 0
        if (lv.interactive && pin && st.cluster) {
          const isMark = i === bodies.length
          const f = isMark ? markFrame(st) : objectFrame(i, st, lv.sequence)
          const dx = f.cx - b.ox - px, dy = f.cy - b.oy - py
          const d = Math.hypot(dx, dy) || 1
          const reach = Math.min(W, H) * 0.220 + f.R
          if (d < reach) {
            const push = Math.pow(1 - d / reach, 2) * Math.min(W, H) * (isMark ? 0.03 : 0.09)
            tx = (dx / d) * push; ty = (dy / d) * push
          }
        }
        b.vx += ((tx - b.ox) * 90 - b.vx * 11) * dt
        b.vy += ((ty - b.oy) * 90 - b.vy * 11) * dt
        b.vs += ((1 - b.s) * 160 - b.vs * 9) * dt
        b.ox += b.vx * dt; b.oy += b.vy * dt; b.s += b.vs * dt
      }
      void L
    }

    let raf = 0, visible = true, onScreen = true, running = false
    const loop = () => {
      raf = 0
      if (!running) return
      const now = performance.now()
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now
      clock += dt * FPS * live.current.speed
      step(dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    const sync = () => {
      const want = visible && onScreen && !reduced
      if (want && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop) }
      else if (!want && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0 }
      if (reduced) draw()
    }

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      px = (e.clientX - r.left) * dpr; py = (e.clientY - r.top) * dpr; pin = true
    }
    const onLeave = () => { pin = false }
    const onDown = (e: PointerEvent) => {
      if (!live.current.interactive || reduced) return
      onMove(e)
      const lv = live.current
      const p = lv.sequence === "cluster" ? 0 : reelPhase()
      const st = stageAt(p, lv.sequence)
      if (!st.cluster) return
      const kick = Math.min(W, H) * 2.20
      const all = [...bodies, markBody]
      for (let i = 0; i < all.length; i++) {
        const isMark = i === bodies.length
        const f = isMark ? markFrame(st) : objectFrame(i, st, lv.sequence)
        const dx = f.cx - px, dy = f.cy - py
        const d = Math.hypot(dx, dy) || 1
        const fall = 1 / (1 + d / (Math.min(W, H) * 0.35))
        all[i].vx += (dx / d) * kick * fall * (isMark ? 0.3 : 1)
        all[i].vy += (dy / d) * kick * fall * (isMark ? 0.30 : 1)
        all[i].vs += (isMark ? 2.5 : 5) * fall
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(root)
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((es) => { onScreen = es[0]?.isIntersecting ?? true; sync() }) : null
    io?.observe(root)
    const onVis = () => { visible = document.visibilityState !== "hidden"; sync() }
    document.addEventListener("visibilitychange", onVis)
    const onMq = () => { reduced = !!mq?.matches; sync() }
    mq?.addEventListener?.("change", onMq)
    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("pointerdown", onDown)
    redraw.current = () => { if (!running) draw() }
    resize()
    sync()

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io?.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      mq?.removeEventListener?.("change", onMq)
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("pointerdown", onDown)
      if (kit) {
        kit.gl.deleteTexture(kit.tex)
        kit.gl.deleteProgram(kit.prog)
        kit.gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    }
  }, [colorKey])

  React.useEffect(() => { redraw.current() }, [wordmark, number, textColor, numberColor, font, sequence])

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background, touchAction: "manipulation", ...style }}
    >
      <canvas ref={glRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <canvas ref={topRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
    </div>
  )
}

export default GlossCluster
