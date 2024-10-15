const defaultOps = { name: "empty", type: "none", weight: 10, data: null, content: "X", formula: () => { return null;}, range: 0, decay: 0, dformula: [] };

function LVector(x,y,dir,vel,pType="",pID="") {
    let me = this;
    me.x = x;
    me.y = y;
    me.dir = 0;
    me.vel = 0;
    me.pType = "";
    me.pID = "";
    if (dir) me.dir = dir;
    if (vel) me.vel = vel;
    me.xHist = [];
    me.yHist = [];
    me.dirHist = [];
    me.velHist = [];

    me.move = (weight = 10) => {
        //if (me.xHist.length > 10) me.xHist.splice(0,me.xHist.length - 10);
        //if (me.yHist.length > 10) me.yHist.splice(0,me.yHist.length - 10);
        //if (me.velHist.length > 10) me.velHist.splice(0,me.velHist.length - 10);
        //if (me.dirHist.length > 10) me.dirHist.splice(0,me.dirHist.length - 10);

        //me.velHist.push(me.vel);
        //me.dirHist.push(me.dir);
        //me.xHist.push(me.x);
        //me.yHist.push(me.y);


        me.vel *= 1 / weight > 0.1 && 1 / weight < 1 ? 1 / weight : 0.9;
        if (me.vel > 100) me.vel = 100;
        else if (me.vel < -100) me.vel = -100;
        me.vel = Math.floor(me.vel * 10000) / 10000;
        me.dir = Math.floor(me.dir * 1000000) / 1000000;
        me.dir = me.dir % 360;

        let dX = me.vel != NaN && me.dir != NaN ? me.vel * Math.cos(me.dir * Math.PI / 180) : 0;
        let dY = me.vel != NaN && me.dir != NaN ? me.vel * Math.sin(me.dir * Math.PI / 180) : 0;
        if (Math.abs(dX) < 0.1) dX = 0;
        else dX = Math.floor(dX * 10000) / 10000;
        if (Math.abs(dY) < 0.1) dY = 0;
        else dY = Math.floor(dY * 10000) / 10000;

        if (dX == 0 && dY == 0 && Math.random() > 0.75) {
            dX = Math.random() > 0.5 ? -1 : 1;
            dY = Math.random() > 0.5 ? -1 : 1;
        }

        let flipped = false;
        if (me.x + dX < 0 || me.x + dX > lf.w) {
            if (dY > 0) me.dir -= 90;
            else if (dY < 0) me.dir += 90;
            else {
                me.dir -= 180;
                flipped = true;
            }
        }
        if (me.y + dY < 0 || me.y + dY > lf.h) {
            if (dX > 0) me.dir += 90;
            else if (dX < 0) me.dir -= 90;
            else if (!flipped) me.dir -= 180;
        }
        else {
            me.x += dX;
            me.y += dY;
        }

        me.dir = me.dir % 360;

        /*
        if (me.vel == NaN || me.dir == NaN || me.x == NaN || me.y == NaN || Math.abs(me.vel) > 300 || Math.abs(me.dir) > 360) {
            lf.stop();
            let lStr = "[" + me.pID + ", " + me.pType + "]";
            console.log(lStr);
            lStr = "x: ";
            for (let j = 0; j < me.xHist.length; j++) {
                lStr += me.xHist[j] + ";";
            }
            console.log(lStr);
            lStr = "y: ";
            for (let j = 0; j < me.yHist.length; j++) {
                lStr += me.yHist[j] + ";";
            }
            console.log(lStr);
            lStr = "dir: ";
            for (let j = 0; j < me.dirHist.length; j++) {
                lStr += me.dirHist[j] + ";";
            }
            console.log(lStr);
            lStr = "vel: ";
            for (let j = 0; j < me.velHist.length; j++) {
                lStr += me.velHist[j] + ";";
            }
            console.log(lStr);
        }
        */

    };

    me.accelerate = (acc) => {
        me.vel += acc;
    };

    me.vel = Math.floor(me.vel * 10000) / 10000;
    me.dir = me.dir % 360;
    me.dir = Math.floor(me.dir * 1000000) / 1000000;
}