function SfHash(w,h,sub) {
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
        Object.keys(items).forEach((iky) => {
            if (items[iky].pos != undefined && items[iky].pos != null && 
                items[iky].pos.x >= 0 && items[iky].pos.x <= me.w && 
                items[iky].pos.y >= 0 && items[iky].pos.y <= me.h &&
                items[iky].active) {
                let hX = Math.floor(items[iky].pos.x / me.sub);
                let hY = Math.floor(items[iky].pos.y / me.sub);
                let tIdx = (hY * me.sW) + hX;
                me.table[tIdx] += items[iky].id + ";";
            }
        });
    }
    me.remove = (id,x,y) => {
        me.table.forEach((h) => { h = h.replace(id + ";","")});
    };
    me.query = (item, type=null) => {
        let res = [];

        if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
            let x = item.pos.x;
            let y = item.pos.y;
            let r = item.ops.range;
            let id = item.id;
            let qX = Math.floor(x / me.sub);
            let qY = Math.floor(y / me.sub);
            for (let i = qX - 1; i <= qX + 1; i++) {
                for (let j = qY - 1; j <= qY + 1; j++) {
                    let qIdx = (j * me.sW) + i;
                    if (qIdx >= 0 && qIdx < me.table.length) {
                        let sLog = false;
                        me.table[qIdx].split(";").forEach((chid) => {
                            if (chid.length > 0 && lf.items[chid] != undefined && lf.items[chid] != null && lf.items[chid].active && id != chid && ((type != null && lf.items[chid].ops.type == type) || type == null)) {
                                let d = Math.hypot(x-lf.items[chid].pos.x, y-lf.items[chid].pos.y);
                                if (Math.abs(d) <= r + lf.items[chid].ops.range) {
                                    res.push(lf.items[chid]);
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