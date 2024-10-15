function LXtra(pos, ops = {}, init = false) {
    let me = this;
    me.id = lf.generateID();
    me.gen = -1;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.life = 0;
    me.hash = "";
    me.ops = ops;
    me.validFuncs = { update: false };
    me.update = () => {
        if (me.validFuncs.update) me.ops.update(me);
    };

    if ("update" in ops || typeof ops.update === 'function') {
        me.validFuncs.update = true;
    }

    if (init && "init" in ops && typeof ops.init === 'function') ops.init(me);
}