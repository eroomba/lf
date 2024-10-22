function LFXtra(pos, core = {}, init = false) {
    let me = this;
    me.id = lf.generateID();
    me.gen = -1;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.life = 0;
    me.hash = "";
    me.core = core;
    me.validFuncs = { update: false };
    me.update = () => {
        if (me.validFuncs.update) me.core.update(me);
    };

    if ("update" in me.core || typeof me.core.update === 'function') {
        me.validFuncs.update = true;
    }

    if (init && "init" in me.core && typeof me.core.init === 'function') me.core.init(me);
}