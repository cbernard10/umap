function Graph(){

    this.idGen = 0
    this.vertices = {}
    this.edges = new Set()
    this.triangles = new Set()

    this.addVertex = (data) => {
        this.vertices = {...this.vertices, [this.idGen]: data}
        this.idGen += 1
    }

    this.linkVertices = (x, y, w) => {
        if(Object.keys(this.vertices).includes(x) && Object.keys(this.vertices).includes(y)){
            this.edges.add([x, y, w])
        }
    }

    this.unlinkVertices = (x, y) => {
        for(edge of this.edges){
            if(edge[0]===x && edge[1]===y){
                this.deleteEdge(edge)
            }
            else if(edge[0]===y && edge[1]===x){
                this.deleteEdge(edge)
            }
        }
    }

    this.unTriangulateVertices = (x, y, z) => {
        for(triangle of this.triangles){
            if(triangle[0]===x && triangle[1]===y && triangle[2]===z){
                this.deleteTriangle(triangle)
            }
            if(triangle[0]===x && triangle[2]===y && triangle[1]===z){
                this.deleteTriangle(triangle)
            }
            if(triangle[1]===x && triangle[0]===y && triangle[2]===z){
                this.deleteTriangle(triangle)
            }
            if(triangle[1]===x && triangle[2]===y && triangle[0]===z){
                this.deleteTriangle(triangle)
            }
            if(triangle[2]===x && triangle[1]===y && triangle[0]===z){
                this.deleteTriangle(triangle)
            }
            if(triangle[2]===x && triangle[0]===y && triangle[1]===z){
                this.deleteTriangle(triangle)
            }
        }
    }

    this.triangulateVertices = (x, y, z, w) => {
        if(
            Object.keys(this.vertices).includes(x) && 
            Object.keys(this.vertices).includes(y) && 
            Object.keys(this.vertices).includes(z)){
            this.triangles.add([x, y, z, w])
        }
    }

    this.deleteVertex = id => {
        delete this.vertices[id]
        for(edge of this.edges){
            if([edge[0], edge[1]].includes(id)){
                this.edges.delete(edge)
            }
        }
        for(triangle of this.triangles){
            if(triangle.includes(id)){
                this.triangles.delete(triangle)
            }
        }
    }

    this.deleteEdge = edge => {
        this.edges.delete(edge)
    }

    this.deleteTriangle = triangle => {
        this.triangles.delete(triangle)
    }

    this.readVertex = id => {
        this.vertices[id]
    }

    this.getEdgeWeight = (a, b) => {
        for(edge of this.edges){
            if(edge[0]===a && edge[1]===b){
                return edge[2]
            }
            else if(edge[1]===a && edge[0]===b){
                return edge[2]
            }
        }
    }

    this.adjacent = (x, y) => {

        for(edge of this.edges){

            const a = edge[0]
            const b = edge[1]

                if((a === x && b === y) || (a === y && b === x)) return true
            }

        return false
    } 

    // this.neighbors = x => {
    //     let neigh = new Set
    //     for(edge of this.edges){
    //         for(let i=0; i<2; i++){
    //             if(edge[0] === x){
    //                 neigh.add(edge[1])
    //                 continue
    //             }
    //             if(edge[1] === x){
    //                 neigh.add(edge[0])
    //                 continue
    //             }
    //         }
    //     }
    //     return neigh
    // }
}

function RealGraph(graph){

    // Graphe réalisé : la représentation du graphe dans un espace métrique
    // Les données des sommets sont des coordonnées x et y et un degré d'appartenance m
    // Les données des arêtes et des n-simplexes, n>1 sont des degrés d'appartenance m

    this.graph = graph
    this.vertexRadius = 5
    this.vertexColor = '#ff00ff'
    this.edgeColor = '#ffffff'
    this.triangleColor = '#00ff00'
    this.fuzzyBallColor = '#D90368'
    this.fuzzyTolerance = 1
    this.n_neighbors = 3
    
    this.euclDist = (x1, y1, x2, y2) => {
        return Math.sqrt( (x1-x2)**2 + (y1-y2)**2 )
    }
        
    this.contains = (x, y) => {
        for(v of Object.keys(this.graph.vertices)){
            if (this.euclDist(x, y, this.graph.vertices[v].x, this.graph.vertices[v].y) < this.graph.vertices[v].r*4){
                return v
            }
        }
        return undefined
    }

    this.addVertex = data => {
        this.graph.addVertex(data)
    }

    this.updateVertex = (v, x, y) => {
        this.graph.vertices[v].x = x
        this.graph.vertices[v].y = y
    }

    this.linkVertices = (a, b) => {
        this.graph.linkVertices(a, b)
    }

    this.triangulateVertices = (a, b, c) => {
        this.graph.triangulateVertices(a, b, c)
    }

    this.deleteVertex = v => {
        this.graph.deleteVertex(v)
    }

    this.drawVertices = () => {
        for(v of Object.keys(this.graph.vertices)){
            const c = new Circle(this.graph.vertices[v].x, this.graph.vertices[v].y, this.graph.vertices[v].r, this.graph.vertices[v].color)
            c.draw()
        }
    }

    this.drawEdges = () => {
        for(edge of this.graph.edges){
            let from = edge[0]
            let to = edge[1]
            const e = new Line(
                this.graph.vertices[from].x, this.graph.vertices[from].y,
                this.graph.vertices[to].x, this.graph.vertices[to].y,
                hexToRGB(this.edgeColor, edge[2]))
            e.draw()
        }
    }

    this.drawTriangles = () => {
        for(triangle of this.graph.triangles){
            const t = new Triangle(
                this.graph.vertices[triangle[0]].x, this.graph.vertices[triangle[0]].y,
                this.graph.vertices[triangle[1]].x, this.graph.vertices[triangle[1]].y,
                this.graph.vertices[triangle[2]].x, this.graph.vertices[triangle[2]].y,
                hexToRGB(this.triangleColor, triangle[3]))
            t.draw()
        }
    }

    this.drawFuzzyBalls = () => {
        if(this.n_neighbors > 1){
            for(v of Object.keys(this.graph.vertices)){
                if(this.graph.vertices[v].neighbors && this.graph.vertices[v].neighbors[0]){
                    const fuzz = new FuzzyBall(
                        this.graph.vertices[v].x, 
                        this.graph.vertices[v].y, 
                        this.graph.vertices[v].neighbors[0].d, 
                        this.graph.vertices[v].neighbors[this.graph.vertices[v].neighbors.length-1].d,
                        this.fuzzyBallColor, this.fuzzyTolerance)

                    fuzz.draw()
                }
            }
        }
        else {
            for(v of Object.keys(this.graph.vertices)){
                if(this.graph.vertices[v].neighbors && this.graph.vertices[v].neighbors[0]){
                    const fuzz = new Circle(
                        this.graph.vertices[v].x, 
                        this.graph.vertices[v].y,
                        this.graph.vertices[v].neighbors[0].d,
                        this.fuzzyBallColor)

                    fuzz.draw()
                }
            }
        }
    }

    this.check_two_circles_overlap = (x1, y1, r1, x2, y2, r2) => {
        const d = this.euclDist(x1, y1, x2, y2)
        return d < (r1 + r2)
    }


    this.two_circles_intersection = (x1, y1, r1, x2, y2, r2) => {

        d = Math.sqrt( (x1-x2)**2 + (y1-y2)**2 )
        l = (r1**2 - r2**2 + d**2)/(2*d)
        h = Math.sqrt(r1**2 - l**2)
    
        const x3 = l/d * (x2-x1) + h/d * (y2-y1) + x1
        const y3 = l/d * (y2-y1) - h/d * (x2-x1) + y1
        const x4 = l/d * (x2-x1) - h/d * (y2-y1) + x1
        const y4 = l/d * (y2-y1) + h/d * (x2-x1) + y1
    
        return [[x3, y3], [x4, y4]]
    
    }

    this.check_three_circles_overlap = (x1, y1, r1, x2, y2, r2, x3, y3, r3) => {

        if(this.check_two_circles_overlap(x1, y1, r1, x2, y2, r2)){
            let pts = this.two_circles_intersection(x1, y1, r1, x2, y2, r2)
            let p3 = pts[0]
            let p4 = pts[1]
            return (this.euclDist(x3, y3, p3[0], p3[1]) < r3 || this.euclDist(x3, y3, p4[0], p4[1]) < r3)
        }
    }

    this.computeFuzzySimplices = () => {

        this.graph.triangles = new Set()
        this.graph.edges = new Set()

        for(vi of Object.keys(this.graph.vertices)){
            for(vj_id of Object.keys(this.graph.vertices[vi].neighbors)){
                const vj = this.graph.vertices[vi].neighbors[vj_id].xi

                if(vi===vj) continue

                console.log(this.compute_sigma(this.graph.vertices[vi].neighbors.map(n => n.d)))
                const xi = this.graph.vertices[vi].x
                const yi = this.graph.vertices[vi].y
                const xj = this.graph.vertices[vj].x
                const yj = this.graph.vertices[vj].y
                const ri = this.graph.vertices[vi].neighbors[this.graph.vertices[vi].neighbors.length-1].d*this.fuzzyTolerance
                const rj = this.graph.vertices[vj].neighbors[this.graph.vertices[vj].neighbors.length-1].d*this.fuzzyTolerance

                const d_ij = this.euclDist(xi, yi, xj, yj) 
                
                if(this.check_two_circles_overlap(xi, yi, ri, xj, yj, rj)){
                    
                    this.graph.linkVertices(vi,vj,1 - (1-d_ij/ri)*(1-d_ij/rj))

                }
            }
        }

        for(vi of Object.keys(this.graph.vertices)){
            for(vj_id of Object.keys(this.graph.vertices[vi].neighbors)){
                const vj = this.graph.vertices[vi].neighbors[vj_id].xi
                for(vk_id of Object.keys(this.graph.vertices[vi].neighbors)){
                    const vk = this.graph.vertices[vi].neighbors[vk_id].xi
                    if(vk===vi || vk===vj) continue

                    const xi = this.graph.vertices[vi].x
                    const yi = this.graph.vertices[vi].y
                    const xj = this.graph.vertices[vj].x
                    const yj = this.graph.vertices[vj].y
                    const xk = this.graph.vertices[vk].x
                    const yk = this.graph.vertices[vk].y
                    const rhoi = this.graph.vertices[vi].neighbors[0].d
                    const rhoj = this.graph.vertices[vj].neighbors[0].d
                    const rhok = this.graph.vertices[vk].neighbors[0].d
                    
                    const ri = this.graph.vertices[vi].neighbors[this.graph.vertices[vi].neighbors.length-1].d*this.fuzzyTolerance
                    const rj = this.graph.vertices[vj].neighbors[this.graph.vertices[vj].neighbors.length-1].d*this.fuzzyTolerance
                    const rk = this.graph.vertices[vk].neighbors[this.graph.vertices[vk].neighbors.length-1].d*this.fuzzyTolerance
                
                    if(this.check_three_circles_overlap(xi, yi, ri, xj, yj, rj, xk, yk, rk)){
        
                        const w_ij = this.graph.getEdgeWeight(vi, vj)
                        const w_ik = this.graph.getEdgeWeight(vi, vk)
                        const w_jk = this.graph.getEdgeWeight(vj, vk)
                        // console.log(w_ij, w_ik, w_jk)
                        
                        if(w_ij && w_ik && w_jk) this.graph.triangulateVertices(vi, vj, vk, 0.5*(1-(1-w_ij)*(1-w_ik)*(1-w_jk)))
                    }
                }
            }
        }
    }

    this.computeFuzzySimplices = () => {
        for(vi of Object.keys(this.graph.vertices)){
            const rho_i = this.graph.vertices[vi].neighbors[0].d
            const sigma_i = this.compute_sigma(this.graph.vertices[vi].neighbors.map(n => n.d))
            for(vj_id of Object.keys(this.graph.vertices[vi].neighbors)){
                // const vj = this.graph.vertices[vi].neighbors[vj_id].xi
                const w_ij = Math.exp(-Math.max(0, this.graph.vertices[vi].neighbors[vj_id].d - rho_i) / sigma_i)
                this.graph.vertices[vi].neighbors[vj_id]['weights'] = w_ij
        }
    }

    this.compute_sigma = d => {
        const k = d.length
        const rho_i = d[0]
        const sigmas = [...Array(1000).keys()].map(e => e)
        const left_side = sigmas.map(s => 
            [...Array(k).keys()].reduce(
                (acc, j) => acc + Math.exp(-Math.max(0, d[j] - rho_i)/s)))
        
        const cost = left_side.map(e => e - Math.log2(k))
        return sigmas[this.idx_where_sign_change(cost)]
    }

    this.idx_where_sign_change = arr => {
        for(let i=1; i<arr.length-1; i++){
            if(arr[i]*arr[i-1] < 0){
                return i
            }
        }
        return null
    }

    this.eliminateDegenerates = () => {

        for(edge of this.graph.edges){
            const unique = new Set(edge)
            if ([...unique].length != edge.length){
                this.graph.deleteEdge(edge)
            }
        }

        for(triangle of this.graph.triangles){
            const unique = new Set(triangle)
            if ([...unique].length != triangle.length){
                this.graph.deleteTriangle(triangle)
            }
        }  
    }

    this.restoreVisuals = () => {
        for(v of Object.keys(this.graph.vertices)){
            this.graph.vertices[v].color = this.vertexColor
            this.graph.vertices[v].r = this.vertexRadius
        }
    }

}
