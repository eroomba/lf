function LFHash(w,h,sub) {
    let me = this;
    me.h = h;
    me.w = w;
    me.sub = sub;
    me.sW = Math.ceil(me.w / me.sub);
    me.sH = Math.ceil(me.h / me.sub);
    me.table = new Array(me.sW * me.sH);
    me.table.fill("");
    me.roll = (items) => {
        me.table.fill("");
        items.forEach((it) => {
            if (it.pos != undefined && it.pos != null && 
                it.pos.x >= 0 && it.pos.x <= me.w && 
                it.pos.y >= 0 && it.pos.y <= me.h &&
                it.active) {
                let hX = Math.floor(it.pos.x / me.sub);
                let hY = Math.floor(it.pos.y / me.sub);
                let tIdx = (hY * me.sW) + hX;
                me.table[tIdx] += it.id + ";";
            }
        });
    }
    me.remove = (id,x,y) => {
        me.table.forEach((h) => { h = h.replace(id + ";","")});
    };
    me.query = (item, type=null, options = {}) => {
        let res = [];
        let qRange = item.core.range;

        if ("range" in options) qRange = options["range"];

        if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
            let x = item.pos.x;
            let y = item.pos.y;
            let r = qRange;
            let id = item.id;
            let qX = Math.floor(x / me.sub);
            let qY = Math.floor(y / me.sub);
            let qSpanX = 1;
            let qSpanY = 1;
            while (r > me.sW * (qSpanX + 1)) qSpanX++;
            while (r > me.sH * (qSpanY + 1)) qSpanY++;
            for (let i = qX - qSpanX; i <= qX + qSpanX; i++) {
                for (let j = qY - qSpanY; j <= qY + qSpanY; j++) {
                    let qIdx = (j * me.sW) + i;
                    if (qIdx >= 0 && qIdx < me.table.length) {
                        let sLog = false;
                        me.table[qIdx].split(";").forEach((chid) => {
                            if (chid.length > 0 && lf.items[lf.iHash[chid]] != undefined && lf.items[lf.iHash[chid]] != null && lf.items[lf.iHash[chid]].active && id != chid && ((type != null && lf.items[lf.iHash[chid]].core.type == type) || type == null)) {
                                let d = Math.hypot(x-lf.items[lf.iHash[chid]].pos.x, y-lf.items[lf.iHash[chid]].pos.y);
                                if (Math.abs(d) <= r + lf.items[lf.iHash[chid]].core.range) {
                                    res.push(lf.items[lf.iHash[chid]]);
                                }
                            }
                        });
                    }
                }
            }
        }

        return res;
    };
}