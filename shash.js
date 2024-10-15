function SHash(w,h,sub) {
    let me = this;
    me.h = h;
    me.w = w;
    me.sub = sub;
    me.table = [{},{}];
    me.xhash = (item,idx) => {
        if (idx == null) idx = 0;
        let hashV = me.hashVal(item.pos.x, item.pos.y);
        let loc = 0;
        if (hashV in me.table[idx]) {
            //if (!me.table[idx][hashV].includes(item.id)) {
                //me.table[idx][hashV].push(item.id);
           // }
           if (me.table[idx][hashV].indexOf(item.id + ";") < 0) {
                me.table[idx][hashV] += item.id + ";";
                item.obj.setAttribute("hashv", hashV);
           }
        }
        else {
            //me.table[idx][hashV] = [ item.id ];
            me.table[idx][hashV] = item.id + ";";
            item.obj.setAttribute("hashv", hashV);
        }
        return hashV;
    };
    me.roll = () => {
        let xCount = 0;
        let xSum = 0;
        Object.keys(me.table[0]).forEach((h) => {
            xCount++;
            xSum += me.table[0][h].length;
        });
        let avg = 0;
        if (xCount > 0) avg = xSum / xCount;
        me.table[0] = me.table[1];
        me.table[1] = {};
    };
    me.hash = (item) => {        
        return me.xhash(item,0);
    };
    me.prehash = (item) => {
        return me.xhash(item,1);
    };
    me.hashVal = (x,y,log=false) => {
        let hX = Math.floor(x / me.sub);
        let hY = Math.floor(y / me.sub);
        return "h-" + hX + "-" + hY;
    };
    me.remove = (id,x,y) => {
        let rmHash = me.hashVal(x,y);
        for (let t = 0; t < me.table.length; t++) {
            if (rmHash in me.table[t]) {
                //for (let r1 = me.table[t][rmHash].length - 1; r1 >= 0; r1--) {
                    //if (me.table[t][rmHash][r1] == id) {
                    //    me.table[t][rmHash].splice(r1,1);
                    //    break;
                    //}
                //}
                me.table[t][rmHash] = me.table[t][rmHash].replace(id + ";","");
            }
        }
    };
    me.query = (item, type=null) => {
        let res = [];

        if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
            let x = item.pos.x;
            let y = item.pos.y;
            let r = item.ops.range;
            let id = item.id;
            for (let i = x-(me.sub + 1); i <= x+(me.sub + 1); i+= me.sub) {
                for (let j=y-(me.sub +1); j <= y+(me.sub + 1); j+= me.sub) {
                    let sLog = false;
                    if (item.ops.type == "drip") sLog = true;
                    let cHash = me.hashVal(i,j,sLog);
                    if (cHash in me.table[0]) {
                        //me.table[0][cHash].forEach((chid) => {
                            //if (lf.items[chid] != undefined && lf.items[chid] != null && lf.items[chid].active && id != chid && ((type != null && lf.items[chid].ops.type == type) || type == null)) {
                            //    let d = Math.hypot(x-lf.items[chid].pos.x, y-lf.items[chid].pos.y);
                            //    if (Math.abs(d) <= r + lf.items[chid].ops.range) res.push(lf.items[chid]);
                            //}
                        //});
                        me.table[0][cHash].split(";").forEach((chid) => {
                            if (lf.items[chid] != undefined && lf.items[chid] != null && lf.items[chid].active && id != chid && ((type != null && lf.items[chid].ops.type == type) || type == null)) {
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