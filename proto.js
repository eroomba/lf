const protoOps = { 
    "proto-1a": {
        name: "proto-1a", 
        type: "proto", 
        data: "proto",
        content: "<html>", 
        formula: () => { 
            return "proto-1a"; 
        }, 
        range: 20, 
        decay: 60,
        dformula: []
    },
    "proto-1b": {
        name: "proto-1b", 
        type: "proto", 
        data: "proto",
        content: "<html>", 
        formula: () => { 
            return "proto-1b"; 
        }, 
        range: 20, 
        decay: 30,
        dformula: []
    }
};

function updateProto(proto) {

    if (proto.life != null)
        proto.life--;
    
    if (proto.life != null && proto.life <= 0 && proto.active) {
        protoDecay(proto);
        proto.deactivate();
    }
    else {
        if (proto.life <= 9) {
            proto.obj.style.opacity = proto.life / 10;
        }
        else {
            proto.obj.style.opacity = 0.9;
        }

        if (proto.life >= 80) {
            let nDir = proto.pos.dir * -1;
            let nVel = 0;
            let nProto = new LItem(new LVector(proto.pos.x, proto.pos.y, nDir, nVel), protoOps[proto.ops.name], {gen: lf.step, codes: proto.dynamic["codes"].splice()}, JSON.parse(JSON.stringify(proto.genetic)));
            nProto.life = 15;
            proto.life -= 15;
            lf.queueItem(nProto);
            console.log("divided!!!");
        }

        let preX = proto.pos.x;
        let preY = proto.pos.y;
        
        lf.behaviors.run(proto, "reset");
        proto.dynamic["codes"].forEach((cd) => {
            lf.behaviors.run(proto, cd);
        });

        if(preX == proto.pos.x && preY == proto.pos.y) {
            proto.pos.x += Math.random() > 0.5 ? -1 : 1;
            proto.pos.y += Math.random() > 0.5 ? -1 : 1;
            proto.pos.dir += Math.random() > 0.5 ? -5 : 5;
        }

        proto.obj.setAttribute("life", proto.life);

        if (proto.active) {
            proto.obj.style.left = proto.pos.x + "px";
            proto.obj.style.top = proto.pos.y + "px";
            proto.obj.style.transform = proto.transformFill.replace("***",proto.pos.dir); //"z " + proto.pos.dir + "deg";

            let tail = proto.obj.querySelector(".mid .back .mv-tail");
            let tRot = (proto.pos.prevDir - proto.pos.dir) * 2;
            if (Math.abs(tRot > 45)) tRot = 45 * (Math.abs(tRot)/tRot);
            if (tail) tail.style.rotate = "z " + tRot + "deg";

            lf.encode(proto,'u');
        }
        else {
            proto.obj.style.display = "none";
        }
    }
}

function protoDecay(proto) {
    let blkCount = 3;
    if (proto.ops.name == "proto-1b") blkCount = 0;

    let itemCount = blkCount;

    let oA = Math.floor(Math.random() * 360);
    for (let m = 0; m < blkCount; m++) {
        let dX = 12 * Math.cos(oA);
        let dY = 12 * Math.cos(oA);
        let nVel = Math.floor(Math.random() * 5) + 5;
        let nBlk = new LItem(new LVector(proto.pos.x + dX, proto.pos.y + dY, oA, nVel), snipOps["snp-blk"], { gen: lf.step, code: "ppp"});
        lf.queueItem(nBlk);
        oA += 360 / blkCount;
        oA = oA % 360;
    }

    strandDecay(proto.dynamic["codes"], proto.pos);
}