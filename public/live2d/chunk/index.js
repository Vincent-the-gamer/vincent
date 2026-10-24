/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */
import { l as t } from '../waifu-tips.js'

class e {
  constructor() { this.live2DModel = null, this.modelMatrix = null, this.eyeBlink = null, this.physics = null, this.pose = null, this.initialized = !1, this.updating = !1, this.alpha = 1, this.accAlpha = 0, this.lipSync = !1, this.lipSyncValue = 0, this.accelX = 0, this.accelY = 0, this.accelZ = 0, this.dragX = 0, this.dragY = 0, this.startTimeMSec = null, this.mainMotionManager = new l(), this.expressionManager = new l(), this.motions = {}, this.expressions = {}, this.isTexLoaded = !1 }getModelMatrix() { return this.modelMatrix }setAlpha(t) { t > 0.999 && (t = 1), t < 0.001 && (t = 0), this.alpha = t }getAlpha() { return this.alpha }isInitialized() { return this.initialized }setInitialized(t) { this.initialized = t }isUpdating() { return this.updating }setUpdating(t) { this.updating = t }getLive2DModel() { return this.live2DModel }setLipSync(t) { this.lipSync = t }setLipSyncValue(t) { this.lipSyncValue = t }setAccel(t, e, i) { this.accelX = t, this.accelY = e, this.accelZ = i }setDrag(t, e) { this.dragX = t, this.dragY = e }getMainMotionManager() { return this.mainMotionManager }getExpressionManager() { return this.expressionManager }loadModelData(e, i) { const s = g.getPlatformManager(); t.info(`Load model : ${e}`), s.loadLive2DModel(e, (e) => { this.live2DModel = e, this.live2DModel.saveParam(); Live2D.getError() == 0 ? (this.modelMatrix = new h(this.live2DModel.getCanvasWidth(), this.live2DModel.getCanvasHeight()), this.modelMatrix.setWidth(2), this.modelMatrix.setCenterPosition(0, 0), i(this.live2DModel)) : t.error('Error : Failed to loadModelData().') }) }loadTexture(e, s, n) { i++; const r = g.getPlatformManager(); t.info(`Load Texture : ${s}`), r.loadTexture(this.live2DModel, e, s, () => { i--, i == 0 && (this.isTexLoaded = !0), typeof n == 'function' && n() }) }loadMotion(e, i, s) { const n = g.getPlatformManager(); t.trace(`Load Motion : ${i}`); let r = null; n.loadBytes(i, (t) => { r = Live2DMotion.loadMotion(t), e != null && (this.motions[e] = r), s(r) }) }loadExpression(e, i, n) { const r = g.getPlatformManager(); t.trace(`Load Expression : ${i}`), r.loadBytes(i, (t) => { e != null && (this.expressions[e] = s.loadJson(t)), typeof n == 'function' && n() }) }loadPose(e, i) {
    const s = g.getPlatformManager(); t.trace(`Load Pose : ${e}`); try { s.loadBytes(e, (t) => { this.pose = d.load(t), typeof i == 'function' && i() }) }
    catch (e) { t.warn(e) }
  }

  loadPhysics(e) {
    const i = g.getPlatformManager(); t.trace(`Load Physics : ${e}`); try { i.loadBytes(e, (t) => { this.physics = c.load(t) }) }
    catch (e) { t.warn(e) }
  }

  hitTestSimple(t, e, i) {
    const s = this.live2DModel.getDrawDataIndex(t); if (s < 0)
      return !1; const n = this.live2DModel.getTransformedPoints(s); let r = this.live2DModel.getCanvasWidth(); let a = 0; let o = this.live2DModel.getCanvasHeight(); let h = 0; for (let t = 0; t < n.length; t += 2) { const e = n[t]; const i = n[t + 1]; e < r && (r = e), e > a && (a = e), i < o && (o = i), i > h && (h = i) } const l = this.modelMatrix.invertTransformX(e); const c = this.modelMatrix.invertTransformY(i); return r <= l && l <= a && o <= c && c <= h
  }
} let i = 0; class s extends AMotion {
  constructor() { super(), this.paramList = [] } static loadJson(t) {
    const e = new s(); const i = g.getPlatformManager().jsonParseFromBytes(t); if (e.setFadeIn(parseInt(i.fade_in) > 0 ? parseInt(i.fade_in) : 1e3), e.setFadeOut(parseInt(i.fade_out) > 0 ? parseInt(i.fade_out) : 1e3), i.params == null)
      return e; const r = i.params; const a = r.length; e.paramList = []; for (let t = 0; t < a; t++) {
      const i = r[t]; const a = i.id.toString(); let o = Number.parseFloat(i.val); const h = i.calc != null ? i.calc.toString() : 'add'; const l = h === 'mult' ? s.TYPE_MULT : h === 'set' ? s.TYPE_SET : s.TYPE_ADD; if (l == s.TYPE_ADD) { o -= i.def == null ? 0 : Number.parseFloat(i.def) }
      else if (l == s.TYPE_MULT) { let t = i.def == null ? 1 : Number.parseFloat(i.def); t == 0 && (t = 1), o /= t } const c = new n(); c.id = a, c.type = l, c.value = o, e.paramList.push(c)
    } return e
  }

  updateParamExe(t, e, i, n) { for (let e = this.paramList.length - 1; e >= 0; --e) { const n = this.paramList[e]; n.type == s.TYPE_ADD ? t.addToParamFloat(n.id, n.value, i) : n.type == s.TYPE_MULT ? t.multParamFloat(n.id, n.value, i) : n.type == s.TYPE_SET && t.setParamFloat(n.id, n.value, i) } }
} function n() { this.id = '', this.type = -1, this.value = null }s.EXPRESSION_DEFAULT = 'DEFAULT', s.TYPE_SET = 0, s.TYPE_ADD = 1, s.TYPE_MULT = 2; class r {constructor() { this.nextBlinkTime = null, this.stateStartTime = null, this.blinkIntervalMsec = null, this.eyeState = a.STATE_FIRST, this.blinkIntervalMsec = 4e3, this.closingMotionMsec = 100, this.closedMotionMsec = 50, this.openingMotionMsec = 150, this.closeIfZero = !0, this.eyeID_L = 'PARAM_EYE_L_OPEN', this.eyeID_R = 'PARAM_EYE_R_OPEN' }calcNextBlink() { return UtSystem.getUserTimeMSec() + Math.random() * (2 * this.blinkIntervalMsec - 1) }setInterval(t) { this.blinkIntervalMsec = t }setEyeMotion(t, e, i) { this.closingMotionMsec = t, this.closedMotionMsec = e, this.openingMotionMsec = i }updateParam(t) { const e = UtSystem.getUserTimeMSec(); let i, s; switch (this.eyeState) { case a.STATE_CLOSING:s = (e - this.stateStartTime) / this.closingMotionMsec, s >= 1 && (s = 1, this.eyeState = a.STATE_CLOSED, this.stateStartTime = e), i = 1 - s; break; case a.STATE_CLOSED:s = (e - this.stateStartTime) / this.closedMotionMsec, s >= 1 && (this.eyeState = a.STATE_OPENING, this.stateStartTime = e), i = 0; break; case a.STATE_OPENING:s = (e - this.stateStartTime) / this.openingMotionMsec, s >= 1 && (s = 1, this.eyeState = a.STATE_INTERVAL, this.nextBlinkTime = this.calcNextBlink()), i = s; break; case a.STATE_INTERVAL:this.nextBlinkTime < e && (this.eyeState = a.STATE_CLOSING, this.stateStartTime = e), i = 1; break; case a.STATE_FIRST:default:this.eyeState = a.STATE_INTERVAL, this.nextBlinkTime = this.calcNextBlink(), i = 1 } this.closeIfZero || (i = -i), t.setParamFloat(this.eyeID_L, i), t.setParamFloat(this.eyeID_R, i) }} function a() {} a.STATE_FIRST = 'STATE_FIRST', a.STATE_INTERVAL = 'STATE_INTERVAL', a.STATE_CLOSING = 'STATE_CLOSING', a.STATE_CLOSED = 'STATE_CLOSED', a.STATE_OPENING = 'STATE_OPENING'; class o {
  constructor() { this.tr = new Float32Array(16), this.identity() } static mul(t, e, i) {
    const s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; let n, r, a; for (n = 0; n < 4; n++) {
      for (r = 0; r < 4; r++) {
        for (a = 0; a < 4; a++)s[n + 4 * r] += t[n + 4 * a] * e[a + 4 * r]
      }
    } for (n = 0; n < 16; n++)i[n] = s[n]
  }

  identity() { for (let t = 0; t < 16; t++) this.tr[t] = t % 5 == 0 ? 1 : 0 }getArray() { return this.tr }getCopyMatrix() { return new Float32Array(this.tr) }setMatrix(t) {
    if (this.tr != null && this.tr.length == this.tr.length) {
      for (let e = 0; e < 16; e++) this.tr[e] = t[e]
    }
  }

  getScaleX() { return this.tr[0] }getScaleY() { return this.tr[5] }transformX(t) { return this.tr[0] * t + this.tr[12] }transformY(t) { return this.tr[5] * t + this.tr[13] }invertTransformX(t) { return (t - this.tr[12]) / this.tr[0] }invertTransformY(t) { return (t - this.tr[13]) / this.tr[5] }multTranslate(t, e) { const i = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, 0, 1]; o.mul(i, this.tr, this.tr) }translate(t, e) { this.tr[12] = t, this.tr[13] = e }translateX(t) { this.tr[12] = t }translateY(t) { this.tr[13] = t }multScale(t, e) { const i = [t, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; o.mul(i, this.tr, this.tr) }scale(t, e) { this.tr[0] = t, this.tr[5] = e }
} class h extends o {constructor(t, e) { super(), this.width = t, this.height = e }setPosition(t, e) { this.translate(t, e) }setCenterPosition(t, e) { const i = this.width * this.getScaleX(); const s = this.height * this.getScaleY(); this.translate(t - i / 2, e - s / 2) }top(t) { this.setY(t) }bottom(t) { const e = this.height * this.getScaleY(); this.translateY(t - e) }left(t) { this.setX(t) }right(t) { const e = this.width * this.getScaleX(); this.translateX(t - e) }centerX(t) { const e = this.width * this.getScaleX(); this.translateX(t - e / 2) }centerY(t) { const e = this.height * this.getScaleY(); this.translateY(t - e / 2) }setX(t) { this.translateX(t) }setY(t) { this.translateY(t) }setHeight(t) { const e = t / this.height; const i = -e; this.scale(e, i) }setWidth(t) { const e = t / this.width; const i = -e; this.scale(e, i) }} class l extends MotionQueueManager {constructor() { super(), this.currentPriority = null, this.reservePriority = null, this.super = MotionQueueManager.prototype }getCurrentPriority() { return this.currentPriority }getReservePriority() { return this.reservePriority }reserveMotion(t) { return !(this.reservePriority >= t) && (!(this.currentPriority >= t) && (this.reservePriority = t, !0)) }setReservePriority(t) { this.reservePriority = t }updateParam(t) { const e = MotionQueueManager.prototype.updateParam.call(this, t); return this.isFinished() && (this.currentPriority = 0), e }startMotionPrio(t, e) { return e == this.reservePriority && (this.reservePriority = 0), this.currentPriority = e, this.startMotion(t, !1) }} class c {constructor() { this.physicsList = [], this.startTimeMSec = UtSystem.getUserTimeMSec() } static load(t) { const e = new c(); const i = g.getPlatformManager().jsonParseFromBytes(t).physics_hair; const s = i.length; for (let t = 0; t < s; t++) { const s = i[t]; const n = new PhysicsHair(); const r = s.setup; const a = Number.parseFloat(r.length); const o = Number.parseFloat(r.regist); const h = Number.parseFloat(r.mass); n.setup(a, o, h); const l = s.src; const c = l.length; for (let t = 0; t < c; t++) { const e = l[t]; const i = e.id; let s = PhysicsHair.Src.SRC_TO_X; const r = e.ptype; r === 'x' ? s = PhysicsHair.Src.SRC_TO_X : r === 'y' ? s = PhysicsHair.Src.SRC_TO_Y : r === 'angle' ? s = PhysicsHair.Src.SRC_TO_G_ANGLE : UtDebug.error('live2d', 'Invalid parameter:PhysicsHair.Src'); const a = Number.parseFloat(e.scale); const o = Number.parseFloat(e.weight); n.addSrcParam(s, i, a, o) } const d = s.targets; const u = d.length; for (let t = 0; t < u; t++) { const e = d[t]; const i = e.id; let s = PhysicsHair.Target.TARGET_FROM_ANGLE; const r = e.ptype; r === 'angle' ? s = PhysicsHair.Target.TARGET_FROM_ANGLE : r === 'angle_v' ? s = PhysicsHair.Target.TARGET_FROM_ANGLE_V : UtDebug.error('live2d', 'Invalid parameter:PhysicsHair.Target'); const a = Number.parseFloat(e.scale); const o = Number.parseFloat(e.weight); n.addTargetParam(s, i, a, o) }e.physicsList.push(n) } return e }updateParam(t) { const e = UtSystem.getUserTimeMSec() - this.startTimeMSec; for (let i = 0; i < this.physicsList.length; i++) this.physicsList[i].update(t, e) }} class d {
  constructor() { this.lastTime = 0, this.lastModel = null, this.partsGroups = [] } static load(t) {
    const e = new d(); const i = g.getPlatformManager().jsonParseFromBytes(t).parts_visible; const s = i.length; for (let t = 0; t < s; t++) {
      const s = i[t].group; const n = s.length; const r = []; for (let t = 0; t < n; t++) {
        const e = s[t]; const i = new u(e.id); if (r[t] = i, e.link == null)
          continue; const n = e.link; const a = n.length; i.link = []; for (let t = 0; t < a; t++) { const e = new u(n[t]); i.link.push(e) }
      }e.partsGroups.push(r)
    } return e
  }

  updateParam(t) {
    if (t == null)
      return; t != this.lastModel && this.initParam(t), this.lastModel = t; const e = UtSystem.getUserTimeMSec(); let i = this.lastTime == 0 ? 0 : (e - this.lastTime) / 1e3; this.lastTime = e, i < 0 && (i = 0); for (let e = 0; e < this.partsGroups.length; e++) this.normalizePartsOpacityGroup(t, this.partsGroups[e], i), this.copyOpacityOtherParts(t, this.partsGroups[e])
  }

  initParam(t) {
    if (t != null) {
      for (let e = 0; e < this.partsGroups.length; e++) {
        const i = this.partsGroups[e]; for (let e = 0; e < i.length; e++) {
          i[e].initIndex(t); const s = i[e].partsIndex; const n = i[e].paramIndex; if (s < 0)
            continue; const r = t.getParamFloat(n) != 0; if (t.setPartsOpacity(s, r ? 1 : 0), t.setParamFloat(n, r ? 1 : 0), i[e].link != null) {
            for (let s = 0; s < i[e].link.length; s++)i[e].link[s].initIndex(t)
          }
        }
      }
    }
  }

  normalizePartsOpacityGroup(t, e, i) {
    let s = -1; let n = 1; const r = 0.5; for (let r = 0; r < e.length; r++) {
      const a = e[r].partsIndex; const o = e[r].paramIndex; if (!(a < 0) && t.getParamFloat(o) != 0) {
        if (s >= 0)
          break; s = r, n = t.getPartsOpacity(a), n += i / 0.5, n > 1 && (n = 1)
      }
    }s < 0 && (s = 0, n = 1); for (let i = 0; i < e.length; i++) {
      const a = e[i].partsIndex; if (!(a < 0)) {
        if (s == i) {
          t.setPartsOpacity(a, n)
        }
        else { let e; let i = t.getPartsOpacity(a); e = n < r ? -0.5 * n / r + 1 : (1 - n) * r / 0.5; (1 - e) * (1 - n) > 0.15 && (e = 1 - 0.15 / (1 - n)), i > e && (i = e), t.setPartsOpacity(a, i) }
      }
    }
  }

  copyOpacityOtherParts(t, e) {
    for (let i = 0; i < e.length; i++) {
      const s = e[i]; if (s.link == null)
        continue; if (s.partsIndex < 0)
        continue; const n = t.getPartsOpacity(s.partsIndex); for (let e = 0; e < s.link.length; e++) { const i = s.link[e]; i.partsIndex < 0 || t.setPartsOpacity(i.partsIndex, n) }
    }
  }
} class u {constructor(t) { this.paramIndex = -1, this.partsIndex = -1, this.link = null, this.id = t }initIndex(t) { this.paramIndex = t.getParamIndex(`VISIBLE:${this.id}`), this.partsIndex = t.getPartsDataIndex(PartsDataID.getID(this.id)), t.setParamFloat(this.paramIndex, 1) }} class m {
  constructor() { this.EPSILON = 0.01, this.faceTargetX = 0, this.faceTargetY = 0, this.faceX = 0, this.faceY = 0, this.faceVX = 0, this.faceVY = 0, this.lastTimeSec = 0 }setPoint(t, e) { this.faceTargetX = t, this.faceTargetY = e }getX() { return this.faceX }getY() { return this.faceY }update() {
    const t = 40 / 7.5 / m.FRAME_RATE; if (this.lastTimeSec == 0)
      return void (this.lastTimeSec = UtSystem.getUserTimeMSec()); const e = UtSystem.getUserTimeMSec(); const i = (e - this.lastTimeSec) * m.FRAME_RATE / 1e3; this.lastTimeSec = e; const s = i * t / (0.15 * m.FRAME_RATE); const n = this.faceTargetX - this.faceX; const r = this.faceTargetY - this.faceY; if (Math.abs(n) <= this.EPSILON && Math.abs(r) <= this.EPSILON)
      return; const a = Math.sqrt(n * n + r * r); const o = t * r / a; let h = t * n / a - this.faceVX; let l = o - this.faceVY; const c = Math.sqrt(h * h + l * l); (c < -s || c > s) && (h *= s / c, l *= s / c), this.faceVX += h, this.faceVY += l; { const t = 0.5 * (Math.sqrt(s * s + 16 * s * a - 8 * s * a) - s); const e = Math.sqrt(this.faceVX * this.faceVX + this.faceVY * this.faceVY); e > t && (this.faceVX *= t / e, this.faceVY *= t / e) } this.faceX += this.faceVX, this.faceY += this.faceVY
  }
}m.FRAME_RATE = 30; class M extends o {constructor() { super(), this.screenLeft = null, this.screenRight = null, this.screenTop = null, this.screenBottom = null, this.maxLeft = null, this.maxRight = null, this.maxTop = null, this.maxBottom = null, this.max = Number.MAX_VALUE, this.min = 0 }getMaxScale() { return this.max }getMinScale() { return this.min }setMaxScale(t) { this.max = t }setMinScale(t) { this.min = t }isMaxScale() { return this.getScaleX() == this.max }isMinScale() { return this.getScaleX() == this.min }adjustTranslate(t, e) { this.tr[0] * this.maxLeft + (this.tr[12] + t) > this.screenLeft && (t = this.screenLeft - this.tr[0] * this.maxLeft - this.tr[12]), this.tr[0] * this.maxRight + (this.tr[12] + t) < this.screenRight && (t = this.screenRight - this.tr[0] * this.maxRight - this.tr[12]), this.tr[5] * this.maxTop + (this.tr[13] + e) < this.screenTop && (e = this.screenTop - this.tr[5] * this.maxTop - this.tr[13]), this.tr[5] * this.maxBottom + (this.tr[13] + e) > this.screenBottom && (e = this.screenBottom - this.tr[5] * this.maxBottom - this.tr[13]); const i = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, 0, 1]; o.mul(i, this.tr, this.tr) }adjustScale(t, e, i) { const s = i * this.tr[0]; s < this.min ? this.tr[0] > 0 && (i = this.min / this.tr[0]) : s > this.max && this.tr[0] > 0 && (i = this.max / this.tr[0]); const n = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, 0, 1]; const r = [i, 0, 0, 0, 0, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; const a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -t, -e, 0, 1]; o.mul(a, this.tr, this.tr), o.mul(r, this.tr, this.tr), o.mul(n, this.tr, this.tr) }setScreenRect(t, e, i, s) { this.screenLeft = t, this.screenRight = e, this.screenTop = s, this.screenBottom = i }setMaxScreenRect(t, e, i, s) { this.maxLeft = t, this.maxRight = e, this.maxTop = s, this.maxBottom = i }getScreenLeft() { return this.screenLeft }getScreenRight() { return this.screenRight }getScreenBottom() { return this.screenBottom }getScreenTop() { return this.screenTop }getMaxLeft() { return this.maxLeft }getMaxRight() { return this.maxRight }getMaxBottom() { return this.maxBottom }getMaxTop() { return this.maxTop }} class g {static getPlatformManager() { return g.platformManager } static setPlatformManager(t) { g.platformManager = t }}g.platformManager = null; const T = 1.5; const p = 1; const S = -1; const v = 1; const E = -2; const P = 2; const _ = -2; const f = 2; const I = 1; const x = 2; const A = 3; const y = 'idle'; const R = 'tap_body'; const O = 'pinch_in'; const D = 'pinch_out'; const L = 'head'; const N = 'body'; class w {
  static reset() { this.depth = 0 } static loadIdentity() { for (let t = 0; t < 16; t++) this.currentMatrix[t] = t % 5 == 0 ? 1 : 0 } static push() { this.depth; const t = 16 * (this.depth + 1); this.matrixStack.length < t + 16 && (this.matrixStack.length = t + 16); for (let e = 0; e < 16; e++) this.matrixStack[t + e] = this.currentMatrix[e]; this.depth++ } static pop() { this.depth--, this.depth < 0 && (this.depth = 0); const t = 16 * this.depth; for (let e = 0; e < 16; e++) this.currentMatrix[e] = this.matrixStack[t + e] } static getMatrix() { return this.currentMatrix } static multMatrix(t) {
    let e, i, s; for (e = 0; e < 16; e++) this.tmp[e] = 0; for (e = 0; e < 4; e++) {
      for (i = 0; i < 4; i++) {
        for (s = 0; s < 4; s++) this.tmp[e + 4 * i] += this.currentMatrix[e + 4 * s] * t[s + 4 * i]
      }
    } for (e = 0; e < 16; e++) this.currentMatrix[e] = this.tmp[e]
  }
}w.matrixStack = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], w.depth = 0, w.currentMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], w.tmp = Array.from({ length: 16 }); class F {constructor() { this.NAME = 'name', this.ID = 'id', this.MODEL = 'model', this.TEXTURES = 'textures', this.HIT_AREAS = 'hit_areas', this.HIT_AREAS_CUSTOM = 'hit_areas_custom', this.PHYSICS = 'physics', this.POSE = 'pose', this.EXPRESSIONS = 'expressions', this.MOTION_GROUPS = 'motions', this.SOUND = 'sound', this.FADE_IN = 'fade_in', this.FADE_OUT = 'fade_out', this.LAYOUT = 'layout', this.INIT_PARAM = 'init_param', this.INIT_PARTS_VISIBLE = 'init_parts_visible', this.VALUE = 'val', this.FILE = 'file', this.json = {} }loadModelSetting(t, e) { g.getPlatformManager().loadBytes(t, (t) => { const i = String.fromCharCode.apply(null, new Uint8Array(t)); this.json = JSON.parse(i), e() }) }getTextureFile(t) { return this.json[this.TEXTURES] == null || this.json[this.TEXTURES][t] == null ? null : this.json[this.TEXTURES][t] }getModelFile() { return this.json[this.MODEL] }getTextureNum() { return this.json[this.TEXTURES] == null ? 0 : this.json[this.TEXTURES].length }getHitAreaNum() { return this.json[this.HIT_AREAS] == null ? 0 : this.json[this.HIT_AREAS].length }getHitAreaCustom() { return this.json[this.HIT_AREAS_CUSTOM] }getHitAreaID(t) { return this.json[this.HIT_AREAS] == null || this.json[this.HIT_AREAS][t] == null ? null : this.json[this.HIT_AREAS][t][this.ID] }getHitAreaName(t) { return this.json[this.HIT_AREAS] == null || this.json[this.HIT_AREAS][t] == null ? null : this.json[this.HIT_AREAS][t][this.NAME] }getPhysicsFile() { return this.json[this.PHYSICS] }getPoseFile() { return this.json[this.POSE] }getExpressionNum() { return this.json[this.EXPRESSIONS] == null ? 0 : this.json[this.EXPRESSIONS].length }getExpressionFile(t) { return this.json[this.EXPRESSIONS] == null ? null : this.json[this.EXPRESSIONS][t][this.FILE] }getExpressionName(t) { return this.json[this.EXPRESSIONS] == null ? null : this.json[this.EXPRESSIONS][t][this.NAME] }getLayout() { return this.json[this.LAYOUT] }getInitParamNum() { return this.json[this.INIT_PARAM] == null ? 0 : this.json[this.INIT_PARAM].length }getMotionNum(t) { return this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][t] == null ? 0 : this.json[this.MOTION_GROUPS][t].length }getMotionFile(t, e) { return this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][t] == null || this.json[this.MOTION_GROUPS][t][e] == null ? null : this.json[this.MOTION_GROUPS][t][e][this.FILE] }getMotionSound(t, e) { return this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][t] == null || this.json[this.MOTION_GROUPS][t][e] == null || this.json[this.MOTION_GROUPS][t][e][this.SOUND] == null ? null : this.json[this.MOTION_GROUPS][t][e][this.SOUND] }getMotionFadeIn(t, e) { return this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][t] == null || this.json[this.MOTION_GROUPS][t][e] == null || this.json[this.MOTION_GROUPS][t][e][this.FADE_IN] == null ? 1e3 : this.json[this.MOTION_GROUPS][t][e][this.FADE_IN] }getMotionFadeOut(t, e) { return this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][t] == null || this.json[this.MOTION_GROUPS][t][e] == null || this.json[this.MOTION_GROUPS][t][e][this.FADE_OUT] == null ? 1e3 : this.json[this.MOTION_GROUPS][t][e][this.FADE_OUT] }getInitParamID(t) { return this.json[this.INIT_PARAM] == null || this.json[this.INIT_PARAM][t] == null ? null : this.json[this.INIT_PARAM][t][this.ID] }getInitParamValue(t) { return this.json[this.INIT_PARAM] == null || this.json[this.INIT_PARAM][t] == null ? NaN : this.json[this.INIT_PARAM][t][this.VALUE] }getInitPartsVisibleNum() { return this.json[this.INIT_PARTS_VISIBLE] == null ? 0 : this.json[this.INIT_PARTS_VISIBLE].length }getInitPartsVisibleID(t) { return this.json[this.INIT_PARTS_VISIBLE] == null || this.json[this.INIT_PARTS_VISIBLE][t] == null ? null : this.json[this.INIT_PARTS_VISIBLE][t][this.ID] }getInitPartsVisibleValue(t) { return this.json[this.INIT_PARTS_VISIBLE] == null || this.json[this.INIT_PARTS_VISIBLE][t] == null ? NaN : this.json[this.INIT_PARTS_VISIBLE][t][this.VALUE] }} class U extends e {
  constructor() { super(), this.modelHomeDir = '', this.modelSetting = null, this.tmpMatrix = [] }loadJSON(t) {
    const e = this.modelSetting; if (!e)
      return; const i = this.modelHomeDir + e.getModelFile(); this.loadModelData(i, (i) => {
      for (let i = 0; i < e.getTextureNum(); i++) {
        const s = this.modelHomeDir + e.getTextureFile(i); this.loadTexture(i, s, () => {
          if (this.isTexLoaded) {
            if (e.getExpressionNum() > 0) { this.expressions = {}; for (let t = 0; t < e.getExpressionNum(); t++) { const i = e.getExpressionName(t); const s = this.modelHomeDir + e.getExpressionFile(t); this.loadExpression(i, s) } }
            else {
              this.expressionManager = null, this.expressions = {}
            } if (this.eyeBlink == null && (this.eyeBlink = new r()), e.getPhysicsFile() != null ? this.loadPhysics(this.modelHomeDir + e.getPhysicsFile()) : this.physics = null, e.getPoseFile() != null ? this.loadPose(this.modelHomeDir + e.getPoseFile(), () => { this.pose && this.live2DModel && this.pose.updateParam(this.live2DModel) }) : this.pose = null, e.getLayout() != null) { const t = e.getLayout(); t.width != null && this.modelMatrix.setWidth(t.width), t.height != null && this.modelMatrix.setHeight(t.height), t.x != null && this.modelMatrix.setX(t.x), t.y != null && this.modelMatrix.setY(t.y), t.center_x != null && this.modelMatrix.centerX(t.center_x), t.center_y != null && this.modelMatrix.centerY(t.center_y), t.top != null && this.modelMatrix.top(t.top), t.bottom != null && this.modelMatrix.bottom(t.bottom), t.left != null && this.modelMatrix.left(t.left), t.right != null && this.modelMatrix.right(t.right) } for (let t = 0; t < e.getInitParamNum(); t++) this.live2DModel.setParamFloat(e.getInitParamID(t), e.getInitParamValue(t)); for (let t = 0; t < e.getInitPartsVisibleNum(); t++) this.live2DModel.setPartsOpacity(e.getInitPartsVisibleID(t), e.getInitPartsVisibleValue(t)); this.live2DModel.saveParam(), this.preloadMotionGroup(y), this.mainMotionManager.stopAllMotions(), this.setUpdating(!1), this.setInitialized(!0), typeof t == 'function' && t()
          }
        })
      }
    })
  }

  async loadModelSetting(t, e) { this.setUpdating(!0), this.setInitialized(!1), this.modelHomeDir = t.substring(0, t.lastIndexOf('/') + 1), this.modelSetting = new F(), this.modelSetting.json = e, await new Promise(t => this.loadJSON(() => t())) }load(t, e, i) { this.setUpdating(!0), this.setInitialized(!1), this.modelHomeDir = e.substring(0, e.lastIndexOf('/') + 1), this.modelSetting = new F(), this.modelSetting.loadModelSetting(e, () => { this.loadJSON(i) }) }release(t) { const e = g.getPlatformManager(); t.deleteTexture(e.texture) }preloadMotionGroup(t) {
    const e = this.modelSetting; if (e) {
      for (let i = 0; i < e.getMotionNum(t); i++) { const s = e.getMotionFile(t, i); this.loadMotion(s, this.modelHomeDir + s, (s) => { s.setFadeIn(e.getMotionFadeIn(t, i)), s.setFadeOut(e.getMotionFadeOut(t, i)) }) }
    }
  }

  update() {
    if (this.live2DModel == null)
      return void t.error('Failed to update.'); const e = 2 * ((UtSystem.getUserTimeMSec() - this.startTimeMSec) / 1e3) * Math.PI; this.mainMotionManager.isFinished() && this.startRandomMotion(y, I), this.live2DModel.loadParam(); this.mainMotionManager.updateParam(this.live2DModel) || this.eyeBlink != null && this.eyeBlink.updateParam(this.live2DModel), this.live2DModel.saveParam(), this.expressionManager == null || this.expressions == null || this.expressionManager.isFinished() || this.expressionManager.updateParam(this.live2DModel), this.live2DModel.addToParamFloat('PARAM_ANGLE_X', 30 * this.dragX, 1), this.live2DModel.addToParamFloat('PARAM_ANGLE_Y', 30 * this.dragY, 1), this.live2DModel.addToParamFloat('PARAM_ANGLE_Z', this.dragX * this.dragY * -30, 1), this.live2DModel.addToParamFloat('PARAM_BODY_ANGLE_X', 10 * this.dragX, 1), this.live2DModel.addToParamFloat('PARAM_EYE_BALL_X', this.dragX, 1), this.live2DModel.addToParamFloat('PARAM_EYE_BALL_Y', this.dragY, 1), this.live2DModel.addToParamFloat('PARAM_ANGLE_X', Number(15 * Math.sin(e / 6.5345)), 0.5), this.live2DModel.addToParamFloat('PARAM_ANGLE_Y', Number(8 * Math.sin(e / 3.5345)), 0.5), this.live2DModel.addToParamFloat('PARAM_ANGLE_Z', Number(10 * Math.sin(e / 5.5345)), 0.5), this.live2DModel.addToParamFloat('PARAM_BODY_ANGLE_X', Number(4 * Math.sin(e / 15.5345)), 0.5), this.live2DModel.setParamFloat('PARAM_BREATH', Number(0.5 + 0.5 * Math.sin(e / 3.2345)), 1), this.physics != null && this.physics.updateParam(this.live2DModel), this.lipSync == null && this.live2DModel.setParamFloat('PARAM_MOUTH_OPEN_Y', this.lipSyncValue), this.pose != null && this.pose.updateParam(this.live2DModel), this.live2DModel.update()
  }

  setRandomExpression() { const t = []; for (const e in this.expressions)t.push(e); const e = Math.floor(Math.random() * t.length); this.setExpression(t[e]) }startRandomMotion(t, e) {
    if (!this.modelSetting)
      return; const i = this.modelSetting.getMotionNum(t); const s = Math.floor(Math.random() * i); this.startMotion(t, s, e)
  }

  startMotion(e, i, s) {
    const n = this.modelSetting.getMotionFile(e, i); if (n == null || n == '')
      return; if (s == A)
      this.mainMotionManager.setReservePriority(s); else if (!this.mainMotionManager.reserveMotion(s))
      return void t.trace('Motion is running.'); let r; this.motions[e] == null ? this.loadMotion(null, this.modelHomeDir + n, (t) => { r = t, this.setFadeInFadeOut(e, i, s, r) }) : (r = this.motions[e], this.setFadeInFadeOut(e, i, s, r))
  }

  setFadeInFadeOut(e, i, s, n) {
    if (!this.modelSetting)
      return; const r = this.modelSetting.getMotionFile(e, i); if (n.setFadeIn(this.modelSetting.getMotionFadeIn(e, i)), n.setFadeOut(this.modelSetting.getMotionFadeOut(e, i)), t.trace(`Start motion : ${r}`), this.modelSetting.getMotionSound(e, i) == null) {
      this.mainMotionManager.startMotionPrio(n, s)
    }
    else { const r = this.modelSetting.getMotionSound(e, i); const a = document.createElement('audio'); a.src = this.modelHomeDir + r, t.trace(`Start sound : ${r}`), a.play(), this.mainMotionManager.startMotionPrio(n, s) }
  }

  setExpression(e) { let i; const s = this.expressions[e]; t.trace(`Expression : ${e}`), (i = this.expressionManager) === null || void 0 === i || i.startMotion(s, !1) }draw(t) { w.push(), w.multMatrix(this.modelMatrix.getArray()), this.tmpMatrix = w.getMatrix(), this.live2DModel.setMatrix(this.tmpMatrix), this.live2DModel.draw(), w.pop() }hitTest(t, e, i) {
    const s = this.modelSetting.getHitAreaNum(); if (s == 0) {
      const s = this.modelSetting.getHitAreaCustom(); if (s) {
        const n = s[`${t}_x`]; const r = s[`${t}_y`]; if (e > Math.min(...n) && e < Math.max(...n) && i > Math.min(...r) && i < Math.max(...r))
          return !0
      }
    } for (let n = 0; n < s; n++) {
      if (t == this.modelSetting.getHitAreaName(n)) { const t = this.modelSetting.getHitAreaID(n); return this.hitTestSimple(t, e, i) }
    } return !1
  }
} class X {
  constructor() { this.cache = {} }loadBytes(t, e) {
    if (t in this.cache)
      return e(this.cache[t]); fetch(t).then(t => t.arrayBuffer()).then((i) => { this.cache[t] = i, e(i) })
  }

  loadLive2DModel(t, e) { let i = null; this.loadBytes(t, (t) => { i = Live2DModelWebGL.loadModel(t), e(i) }) }loadTexture(e, i, s, n) {
    const r = new Image(); r.crossOrigin = 'anonymous', r.src = s, r.onload = () => {
      const s = document.getElementById('live2d'); if (!s)
        return t.error('Canvas live2d not found.'), -1; const a = s.getContext('webgl2', { premultipliedAlpha: !0, preserveDrawingBuffer: !0 }); if (!a)
        return t.error('Failed to create WebGL context.'), -1; const o = a.createTexture(); if (!o)
        return t.error('Failed to generate gl texture name.'), -1; e.isPremultipliedAlpha() == 0 && a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, 1), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, o), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, r), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_NEAREST), a.generateMipmap(a.TEXTURE_2D), e.setTexture(i, o), typeof n == 'function' && n()
    }, r.onerror = () => { t.error(`Failed to load image : ${s}`) }
  }

  jsonParseFromBytes(t) { let e; const i = new Uint8Array(t, 0, 3); e = i[0] == 239 && i[1] == 187 && i[2] == 191 ? String.fromCharCode.apply(null, new Uint8Array(t, 3)) : String.fromCharCode.apply(null, new Uint8Array(t)); return JSON.parse(e) }
} class j {
  constructor() { this.model = null, this.reloading = !1, Live2D.init(), g.setPlatformManager(new X()) }getModel() { return this.model }releaseModel(t) { this.model && (this.model.release(t), this.model = null) } async changeModel(t, e) {
    return new Promise((i, s) => {
      if (this.reloading)
        return; this.reloading = !0; const n = this.model; const r = new U(); r.load(t, e, () => { n && n.release(t), this.model = r, this.reloading = !1, i() })
    })
  }

  async changeModelWithJSON(t, e, i) {
    if (this.reloading)
      return; this.reloading = !0; const s = this.model; const n = new U(); await n.loadModelSetting(e, i), s && s.release(t), this.model = n, this.reloading = !1
  }

  setDrag(t, e) { this.model && this.model.setDrag(t, e) }maxScaleEvent() { t.trace('Max scale event.'), this.model && this.model.startRandomMotion(O, x) }minScaleEvent() { t.trace('Min scale event.'), this.model && this.model.startRandomMotion(D, x) }tapEvent(e, i) { return t.trace(`tapEvent view x:${e} y:${i}`), !!this.model && (this.model.hitTest(L, e, i) ? (t.trace('Tap face.'), this.model.setRandomExpression()) : this.model.hitTest(N, e, i) && (t.trace('Tap body.'), this.model.startRandomMotion(R, x)), !0) }
} function Y(t, e, i, s, n, r) { const a = t - i; const o = e - s; let h, l; return h = a >= 0 ? a / (n - i) : a / i, l = o >= 0 ? o / (r - s) : o / s, { vx: h, vy: -l } } class G {
  constructor() { this._drawFrameId = null, this.live2DMgr = new j(), this.isDrawStart = !1, this.gl = null, this.canvas = null, this.dragMgr = null, this.viewMatrix = null, this.projMatrix = null, this.deviceToScreen = null, this.oldLen = 0, this._boundMouseEvent = this.mouseEvent.bind(this), this._boundTouchEvent = this.touchEvent.bind(this) }initL2dCanvas(t) { this.canvas = document.getElementById(t), this.canvas && this.canvas.addEventListener && (this.canvas.addEventListener('mousewheel', this._boundMouseEvent, !1), this.canvas.addEventListener('click', this._boundMouseEvent, !1), document.addEventListener('mousemove', this._boundMouseEvent, !1), document.addEventListener('mouseout', this._boundMouseEvent, !1), this.canvas.addEventListener('contextmenu', this._boundMouseEvent, !1), this.canvas.addEventListener('touchstart', this._boundTouchEvent, !1), this.canvas.addEventListener('touchend', this._boundTouchEvent, !1), this.canvas.addEventListener('touchmove', this._boundTouchEvent, !1)) } async init(e, i, s) {
    if (this.initL2dCanvas(e), !this.canvas)
      return void t.error(`Canvas ${e} not found.`); const n = this.canvas.width; const r = this.canvas.height; this.dragMgr = new m(); const a = r / n; const h = S; const l = v; const c = -a; const d = a; this.viewMatrix = new M(), this.viewMatrix.setScreenRect(h, l, c, d), this.viewMatrix.setMaxScreenRect(E, P, _, f), this.viewMatrix.setMaxScale(T), this.viewMatrix.setMinScale(p), this.projMatrix = new o(), this.projMatrix.multScale(1, n / r), this.deviceToScreen = new o(), this.deviceToScreen.multTranslate(-n / 2, -r / 2), this.deviceToScreen.multScale(2 / n, -2 / n), this.gl = this.canvas.getContext('webgl2', { premultipliedAlpha: !0, preserveDrawingBuffer: !0 }), this.gl ? (Live2D.setGL(this.gl), this.gl.clearColor(0, 0, 0, 0), await this.changeModelWithJSON(i, s), this.startDraw()) : t.error('Failed to create WebGL context.')
  }

  destroy() { this.canvas && (this.canvas.removeEventListener('mousewheel', this._boundMouseEvent, !1), this.canvas.removeEventListener('click', this._boundMouseEvent, !1), document.removeEventListener('mousemove', this._boundMouseEvent, !1), document.removeEventListener('mouseout', this._boundMouseEvent, !1), this.canvas.removeEventListener('contextmenu', this._boundMouseEvent, !1), this.canvas.removeEventListener('touchstart', this._boundTouchEvent, !1), this.canvas.removeEventListener('touchend', this._boundTouchEvent, !1), this.canvas.removeEventListener('touchmove', this._boundTouchEvent, !1)), this._drawFrameId && (window.cancelAnimationFrame(this._drawFrameId), this._drawFrameId = null), this.isDrawStart = !1; const t = this.live2DMgr; typeof t.release == 'function' && t.release(), this.gl, this.canvas = null, this.gl = null, this.dragMgr = null, this.viewMatrix = null, this.projMatrix = null, this.deviceToScreen = null }startDraw() { if (!this.isDrawStart) { this.isDrawStart = !0; const t = () => { this.draw(), this._drawFrameId = window.requestAnimationFrame(t) }; t() } }draw() {
    if (!(this.dragMgr && this.gl && this.projMatrix && this.viewMatrix))
      return; w.reset(), w.loadIdentity(), this.dragMgr.update(), this.live2DMgr.setDrag(this.dragMgr.getX(), this.dragMgr.getY()), this.gl.clear(this.gl.COLOR_BUFFER_BIT), w.multMatrix(this.projMatrix.getArray()), w.multMatrix(this.viewMatrix.getArray()), w.push(); const t = this.live2DMgr.getModel(); t != null && (t.initialized && !t.updating && (t.update(), t.draw(this.gl)), w.pop())
  }

  async changeModel(t) { this.gl && await this.live2DMgr.changeModel(this.gl, t) } async changeModelWithJSON(t, e) { this.gl && await this.live2DMgr.changeModelWithJSON(this.gl, t, e) }modelScaling(t) {
    if (!this.viewMatrix)
      return; const e = this.viewMatrix.isMaxScale(); const i = this.viewMatrix.isMinScale(); this.viewMatrix.adjustScale(0, 0, t), e || this.viewMatrix.isMaxScale() && this.live2DMgr.maxScaleEvent(), i || this.viewMatrix.isMinScale() && this.live2DMgr.minScaleEvent()
  }

  modelTurnHead(e) {
    let i; if (!this.canvas || !this.dragMgr)
      return; const s = this.canvas.getBoundingClientRect(); const { vx: n, vy: r } = Y(e.clientX, e.clientY, s.left + s.width / 2, s.top + s.height / 2, window.innerWidth, window.innerHeight); t.trace(`onMouseDown device( x:${e.clientX} y:${e.clientY} ) view( x:${n} y:${r})`), this.dragMgr.setPoint(n, r), this.live2DMgr.tapEvent(n, r), ((i = this.live2DMgr.model) === null || void 0 === i ? void 0 : i.hitTest(N, n, r)) && window.dispatchEvent(new Event('live2d:tapbody'))
  }

  followPointer(e) {
    let i; if (!this.canvas || !this.dragMgr)
      return; const s = this.canvas.getBoundingClientRect(); const { vx: n, vy: r } = Y(e.clientX, e.clientY, s.left + s.width / 2, s.top + s.height / 2, window.innerWidth, window.innerHeight); t.trace(`onMouseMove device( x:${e.clientX} y:${e.clientY} ) view( x:${n} y:${r})`), this.dragMgr.setPoint(n, r), ((i = this.live2DMgr.model) === null || void 0 === i ? void 0 : i.hitTest(N, n, r)) && window.dispatchEvent(new Event('live2d:hoverbody'))
  }

  lookFront() { let t; (t = this.dragMgr) === null || void 0 === t || t.setPoint(0, 0) }mouseEvent(t) { t.preventDefault(), t.type == 'mousewheel' ? t.wheelDelta > 0 ? this.modelScaling(1.1) : this.modelScaling(0.9) : t.type == 'click' || t.type == 'contextmenu' ? this.modelTurnHead(t) : t.type == 'mousemove' ? this.followPointer(t) : t.type == 'mouseout' && this.lookFront() }touchEvent(t) {
    t.preventDefault(); const e = t.touches[0]; if (t.type == 'touchstart') {
      t.touches.length == 1 && this.modelTurnHead(e)
    }
    else if (t.type == 'touchmove') { if (this.followPointer(e), t.touches.length == 2) { const e = t.touches[0]; const i = t.touches[1]; const s = (e.pageX - i.pageX) ** 2 + (e.pageY - i.pageY) ** 2; this.oldLen - s < 0 ? this.modelScaling(1.025) : this.modelScaling(0.975), this.oldLen = s } }
    else {
      t.type == 'touchend' && this.lookFront()
    }
  }

  transformViewX(t) {
    if (!this.deviceToScreen || !this.viewMatrix)
      return 0; const e = this.deviceToScreen.transformX(t); return this.viewMatrix.invertTransformX(e)
  }

  transformViewY(t) {
    if (!this.deviceToScreen || !this.viewMatrix)
      return 0; const e = this.deviceToScreen.transformY(t); return this.viewMatrix.invertTransformY(e)
  }

  transformScreenX(t) { let e, i; return (i = (e = this.deviceToScreen) === null || void 0 === e ? void 0 : e.transformX(t)) !== null && void 0 !== i ? i : 0 }transformScreenY(t) { let e, i; return (i = (e = this.deviceToScreen) === null || void 0 === e ? void 0 : e.transformY(t)) !== null && void 0 !== i ? i : 0 }
} export { G as default }
// # sourceMappingURL=index.js.map
