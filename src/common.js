
    /* Aux functions- Maze sharing */

    Array.prototype.repeat= function(what, L){
     while(L) this[--L]= what;
     return this;
    }
    String.prototype.replaceArray = function(find, replace) {
      var replaceString = this;
      for (var i = 0; i < find.length; i++) {
        replaceString = replaceString.replace(find[i], replace[i]);
      }
      return replaceString;
    };

    var QueryString = function () {
      // This function is anonymous, is executed immediately and 
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.hash.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
      return query_string;
    }();

    function cyph(str){
      return str.replace()
    }

    /* Shuffle */

    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }

    /* Maze functions */
    /* Replication Single objects for maze */

    function buildPath(maze, pos){
      var neighbor = [];
      maze[pos[0]][pos[1]] = 1;
      if(pos[0] > 0) neighbor.push([pos[0]-1,pos[1]  ]);
      if(pos[1] > 0) neighbor.push([pos[0]  ,pos[1]-1]);
      if(pos[0] < maze.length-1)    neighbor.push([pos[0]+1,pos[1]  ]);
      if(pos[1] < maze[0].length-1) neighbor.push([pos[0]  ,pos[1]+1]);

      shuffle(neighbor);

      for (var i = neighbor.length - 1; i >= 0; i--) {

        if(maze[neighbor[i][0]][neighbor[i][1]] == 0 && countNeighbors(maze, neighbor[i]) == 1){
          buildPath(maze, neighbor[i]);
        }
      }
    }

    function countNeighbors(maze, pos){
      var res = 0;
      if(pos[0] > 0 && maze[pos[0]-1][pos[1]] == 1){
        res++;
      }
      if(pos[1] > 0 && maze[pos[0]][pos[1]-1] == 1){
        res++;
      }
      if(pos[0] < maze.length-1 && maze[pos[0]+1][pos[1]] == 1){
        res++;
      }
      if(pos[1] < maze[0].length-1 && maze[pos[0]][pos[1]+1] == 1){
        res++;
      }
      return res;
    }


    function lookNeighbors(maze, pos, look){
      var res = [];
      if(look != 270 && pos[0] > 0 && maze[pos[0]-1][pos[1]] == 1){
        res.push([pos[0]-1,pos[1]]);
      }
      if(look != 180 && pos[1] > 0 && maze[pos[0]][pos[1]-1] == 1){
        res.push([pos[0],pos[1]-1]);
      }
      if(look != 90 && pos[0] < maze.length-1 && maze[pos[0]+1][pos[1]] == 1){
        res.push([pos[0]+1,pos[1]]);
      }
      if(look != 0 && pos[1] < maze[0].length-1 && maze[pos[0]][pos[1]+1] == 1){
        res.push([pos[0],pos[1]+1]);
      }
      shuffle(res);
      return res;
    }

    /* Graphics functions */

    function paintMaze(maze){
      var maze_height = maze.length;
      var maze_width = maze[0].length;

      var scene = document.getElementById('scene');

      // Clean scene
      var aplanes = document.getElementsByTagName('a-plane');
      for (var i = aplanes.length - 1; i >= 0; i--) {
        scene.remove(aplanes[i]);
      }
      var aboxes = document.getElementsByTagName('a-box');
      for (var i = aboxes.length - 1; i >= 0; i--) {
        scene.remove(aboxes[i]);
      }

      // Print ground
      var plane_ground = document.createElement("a-plane");
      plane_ground.setAttribute('static-body','');
      plane_ground.setAttribute('height',3*maze_height);
      plane_ground.setAttribute('width',3*maze_width);
      plane_ground.setAttribute('position','0 0 0');
      plane_ground.setAttribute('rotation','90 0 0');
      plane_ground.setAttribute('material','src: #asset_ground;side: double;repeat: '+maze_width+' '+maze_height);

      scene.appendChild(plane_ground);

      // Print roof
      var plane_roof = document.createElement("a-plane");
      plane_roof.setAttribute('static-body','');
      plane_roof.setAttribute('height',3*maze_height);
      plane_roof.setAttribute('width',3*maze_width);
      plane_roof.setAttribute('position','0 3 0');
      plane_roof.setAttribute('rotation','90 0 0');
      plane_roof.setAttribute('material','src: #asset_roof;side: double;repeat: '+maze_width+' '+maze_height);

      scene.appendChild(plane_roof);

      // Print walls
      var plane_wall = document.createElement("a-plane");
      plane_wall.setAttribute('static-body','');
      plane_wall.setAttribute('height',3);
      plane_wall.setAttribute('width',3*maze_width);
      plane_wall.setAttribute('position','0 1.5 '+(3*((maze_height)*.5)));
      plane_wall.setAttribute('rotation','0 0 0');
      plane_wall.setAttribute('material','src: #asset_wall;side: double;repeat: '+maze_width+' 1');

      scene.appendChild(plane_wall);

      plane_wall = document.createElement("a-plane");
      plane_wall.setAttribute('static-body','');
      plane_wall.setAttribute('height',3);
      plane_wall.setAttribute('width',3*maze_width);
      plane_wall.setAttribute('position','0 1.5 -'+(3*((maze_height)*.5)));
      plane_wall.setAttribute('rotation','0 0 0');
      plane_wall.setAttribute('material','src: #asset_wall;side: double;repeat: '+maze_width+' 1');

      scene.appendChild(plane_wall);

      plane_wall = document.createElement("a-plane");
      plane_wall.setAttribute('static-body','');
      plane_wall.setAttribute('height',3);
      plane_wall.setAttribute('width',3*maze_height);
      plane_wall.setAttribute('position',(3*((maze_width)*.5))+' 1.5 0');
      plane_wall.setAttribute('rotation','0 90 0');
      plane_wall.setAttribute('material','src: #asset_wall;side: double;repeat: '+maze_height+' 1');

      scene.appendChild(plane_wall);

      plane_wall = document.createElement("a-plane");
      plane_wall.setAttribute('static-body','');
      plane_wall.setAttribute('height',3);
      plane_wall.setAttribute('width',3*maze_height);
      plane_wall.setAttribute('position',(-3*((maze_width)*.5))+' 1.5 0');
      plane_wall.setAttribute('rotation','0 90 0');
      plane_wall.setAttribute('material','src: #asset_wall;side: double;repeat: '+maze_height+' 1');

      scene.appendChild(plane_wall);

      // Set camera position
      var free1=0,free2=0;
      while(maze[free1][free2] != 1){
        free1++;
        if(free1 >= maze_height){
          free1 = 0;
          free2++;
        }
      }
      var cam = document.getElementById('camera');
      cam.setAttribute('position',(3*(free2-(maze_width-1)*.5))+' 1.6 '+(3*(free1-(maze_height-1)*.5)));

      // Print instructions
      var plane_instructions = document.createElement("a-box");
      plane_instructions.setAttribute('height',1.5);
      plane_instructions.setAttribute('width',2.7);
      plane_instructions.setAttribute('look-at','#camera');
      plane_instructions.setAttribute('rotation','0 90 0');
      plane_instructions.setAttribute('position',(3*(free2-(maze_width-1)*.5))+' 1 '+(3*(free1-(maze_height-1)*.5)));
      plane_instructions.setAttribute('material','src: #asset_instruction;');

      scene.appendChild(plane_instructions); 
      

      //reload
      var reload = document.createElement("a-box");
      reload.setAttribute('on-click','');
      reload.setAttribute('height',0.3);
      reload.setAttribute('width',0.3);
      reload.setAttribute('look-at','#camera');
      reload.setAttribute('rotation','0 90 0');
      reload.setAttribute('position','-25.5 2 -19');
      reload.setAttribute('material','src: #asset_reload;');

      scene.appendChild(reload);

      // Set final portal position
      var free1=maze_height-1,free2=maze_width-1;
      while(maze[free1][free2] != 1){
        free1--;
        if(free1 <= 0){
          free1 = maze_height-1;
          free2--;
        }
      }

      // door
      var box_price = document.createElement("a-box");
          box_price.setAttribute('static-body','');
          box_price.setAttribute('src','#door');
          box_price.setAttribute('id','price');
          box_price.setAttribute('height',2);
          box_price.setAttribute('width',1);
          box_price.setAttribute('depth',1);
          box_price.setAttribute('rotation','0 0 0');
          box_price.setAttribute('position',(3*(free2-(maze_width-1)*.5))+' 1 '+(3*(free1-(maze_height-1)*.5)));

          scene.appendChild(box_price);

      // Print all walls as boxes
      for(var i = 0; i < maze_height; i++){
        for(var j = 0; j < maze_width; j++){
          if(maze[i][j] == 1){
            continue;
          }
          var box_wall = document.createElement("a-box");
          box_wall.setAttribute('static-body','');
          box_wall.setAttribute('height',3);
          box_wall.setAttribute('width',3);
          box_wall.setAttribute('depth',3);
          box_wall.setAttribute('position',(3*(j-(maze_width-1)*.5))+' 1.5 '+(3*(i-(maze_height-1)*.5)));
          box_wall.setAttribute('material','src: #asset_wall');

          scene.appendChild(box_wall);
        }
      }
    }