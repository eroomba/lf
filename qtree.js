function QuadTree(x,y,w,h,root = true) {
    let me = this;
    me.id = "qt-" + Math.floor(Math.random() * 40000);
    me.items = [];
    me.obj = null;
    me.capacity = 8;
    me.w = w;
    me.h = h;
    me.x = x;
    me.y = y;
    me.divided = false;
    me.children = [];
    me.level = 0;
    me.root = root;
    me.count = 0;

    me.add = (item) => {
      if (me.inside(item)) {
        if (me.items.length < me.capacity || me.w <= 20 || me.h <= 20) {
          me.items.push(item);
          me.count++;
          return "added";
        }
        else {
          if (!me.divided) {
            let cw = me.w / 2.0;
            let ch = me.h / 2.0;
            me.children.push(new QuadTree(me.x, me.y, cw, ch, false));
            me.children.push(new QuadTree(me.x + cw, me.y, cw, ch, false));
            me.children.push(new QuadTree(me.x + cw, me.y + ch, cw, ch, false));
            me.children.push(new QuadTree(me.x, me.y + ch, cw, ch, false));
            me.divided = true;
          }
          let added = "ch failed";
          me.children.forEach((c) => {
            c.level = me.level + 1;
            if (added != "added") {
              added = c.add(item);
            }
          });
          return added;
        }
      }

      return "not inside";
    };

    me.getCount = () => {
      let sum = me.count;
      if (me.divided) {
        me.children.forEach((c) => {
          sum += c.getCount();
        });
      }
      return sum;
    }
    
    me.inside = (item) => {
      if (item.pos.x > me.x + me.w || item.pos.x < me.x) return false;
      else if (item.pos.y > me.y + me.h || item.pos.y < me.y) return false;
      return true;
    };
    
    me.intersect = (x1,y1,x2,y2) => {
      return !(me.x + me.w < x1 || 
               me.x > x2 || 
               me.y + me.h < y1 || 
               me.y > y2);
    }
    
    me.query = (id, x1, y1, x2, y2, type = null) => {
      let found = [];
      if (me.intersect(x1,y1,x2,y2)) {
        me.items.forEach((it) => {
          if (it.id != id && it.active) {
            if (it.pos.x >= x1 && it.pos.x <= x2 && it.pos.y >= y1 && it.pos.y <= y2 && it.active) {
              if (type != null) {
                if (type == item.ops.type) found.push(item);
              }
              else found.push(item);
            }
          }
        });
        if (me.divided) {
          me.children.forEach((c) => {
            found.push(...c.query(id,x1,y1,x2,y2));
          });
        }
      }
      
      return found;
    };

    me.queryC = (id, x1, y1, r, type = null, flag = false) => {
      let found = [];
      if (me.intersect(x1-r,y1-r,x1+r,y1+r)) {
        me.items.forEach((it) => {
          if (it.id != id && it.active) {
            let dx = Math.abs(it.pos.x - x1);
            let dy = Math.abs(it.pos.y - y1);
            let d = Math.sqrt(dx*dx + dy*dy);
            let db = "d-" + d + "-" + it.ops.range + "-" + r + "-[" + it.pos.x + "," + it.pos.y + "]-[" + x1 + "," + y1 + "]\;";
            if (d < it.ops.range + r) {
              if (type != null) {
                if (type == it.ops.type) {
                  found.push(it);
                  db += "f1\;";
                }
                else {
                  db += "fx1\;";
                }
              }
              else {
                found.push(it);
                db += "f2\;";
              }
            }
            else {
              db += "out\;";
            }

            if (flag) {
              it.obj.setAttribute("debug", db);
              //it.obj.style.border = "1px solid green";
            }
          }
        });
      }

      if (me.divided) {
        me.children.forEach((c) => {
          found.push(...c.queryC(id,x1,y1,r,type, flag));
        });
      }
      
      return found;
    };

    me.remove = (itemID) => {
      for (let k = me.items.length - 1; k >= 0; k--) {
        if (me.items[k] == undefined || me.items[k] == null || me.items[k].id == itemID) me.items.splice(k,1);
      }
      if (me.divided) {
        me.children.forEach((c) => {
          c.remove(itemID);
        });
      }
    };
  }