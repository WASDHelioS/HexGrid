class PathFinder {

    static find = function(cubeStart, cubeDestination, map) {

        if(cubeStart == cubeDestination) return;
    
        let open = [];
        let closed = [];
    
        open.push({c: cubeStart,parent: null, f: cube_distance(cubeStart, cubeDestination) * 2});
        let next;
    
        while(open.length > 0) {
            next = open.reduce((c1,c2) => {if(c1.f > c2.f) { return c2} return c1});
            open.remove(next);
    
            let surroundingCubes = cube_neighbors(next.c);
            let destCheck = surroundingCubes.find(c => cube_matches(c, cubeDestination))
            if(destCheck) {
                next = {
                    c:destCheck, 
                    parent:next,
                    f:0, 
                    dir:cube_direction(next.c, destCheck)
                };
                break;
            }
    
            surroundingCubes.forEach(cube => {
                if(!closed.find(c => cube_matches(c.c, cube))) {
                    let presentInOpen = open.find(c => cube_matches(c.c, cube))
    
                    if(presentInOpen) {
                        if(presentInOpen.f > cube_distance(cube, cubeDestination) * 2 + pos_distance(getByKey(map,cube).transform.position, getByKey(map,cubeDestination).transform.position)) {
                            presentInOpen.f = cube_distance(cube, cubeDestination) * 2 + pos_distance(cube, cubeDestination);
                            presentInOpen.parent = next;
                            presentInOpen.dir = cube_direction(next.c, cube);
                        }
                    } else {
                        open.push({
                            c: cube, 
                            parent:next, 
                            f: cube_distance(cube, cubeDestination) * 2 + pos_distance(getByKey(map, cube).transform.position, getByKey(map, cubeDestination).transform.position), 
                            dir:cube_direction(next.c, cube)
                        });
                    }
                }
            });
    
            closed.push(next);
        }

        let path = [];
    
        while(next.parent) {
    
            if(next.parent) {
                path.push(next.dir);
                next = next.parent;
            }
        }
        return path;
    }
}