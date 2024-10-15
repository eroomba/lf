const protoOps = { 
    name: "proto", 
    type: "proto", 
    data: "proto",
    content: "<html>", 
    formula: () => { 
        return "proto"; 
    }, 
    range: 20, 
    decay: 20,
    dformula: [] 
};

function updateProto(proto) {

    if (proto.life != null)
        proto.life--;
    
    if (proto.life != null && proto.life <= 0 && proto.active) {

        // TO DO

        proto.deactivate();
    }
    else {
        if (proto.life <= 9) {
            proto.obj.style.opacity = proto.life / 10;
        }
        else {
            proto.obj.style.opacity = 0.9;
        }

        if (proto.life >= 30) {
            let nDir = proto.pos.dir * -1;
            let nVel = 0;
            let nProto = new LItem(new LVector(proto.pos.x, proto.pos.y, nDir, nVel), protoOps, {gen: lf.step, codes: proto.dynamic["codes"].splice(), genetic: JSON.parse(JSON.stringify(proto.dynamic["genetic"]))});
            nProto.life = 15;
            proto.life -= 15;
            lf.queueItem(nProto);
            console.log("divided!!!");
        }

        let preX = proto.pos.x;
        let preY = proto.pos.y;
        
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
            proto.obj.style.rotate = "z " + proto.pos.dir + "deg";

            lf.encode(proto,'u');
        }
        else {
            proto.obj.style.display = "none";
        }
    }
}