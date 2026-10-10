export type SceneKind = 'room' | 'workbench' | 'meal' | 'demo'
type Vec = [number, number, number]
type Palette = Record<'floor' | 'paper' | 'warm' | 'blue' | 'dark' | 'metal' | 'green' | 'food' | 'shadow', Vec>

export function sceneGeometry(kind: SceneKind, light = true) {
  const colors: Palette = light ? {
    floor: [.84, .86, .88], paper: [.97, .96, .93], warm: [.73, .64, .53], blue: [.44, .65, .82],
    dark: [.17, .24, .31], metal: [.63, .7, .76], green: [.4, .56, .45], food: [.77, .49, .29], shadow: [.66, .68, .7],
  } : {
    floor: [.24, .28, .33], paper: [.81, .83, .81], warm: [.64, .52, .4], blue: [.44, .65, .82],
    dark: [.1, .15, .22], metal: [.43, .5, .57], green: [.35, .5, .39], food: [.68, .43, .24], shadow: [.15, .19, .24],
  }
  const vertices: number[] = []
  const triangle = (points: Vec[], normal: Vec, color: Vec) => points.forEach(point => vertices.push(...point, ...normal, ...color))
  const face = (points: Vec[], normal: Vec, color: Vec) => {
    triangle([points[0], points[1], points[2]], normal, color)
    triangle([points[0], points[2], points[3]], normal, color)
  }
  const box = (x: number, y: number, z: number, width: number, height: number, depth: number, color: Vec) => {
    const a = x - width / 2, b = x + width / 2, c = y - height / 2, d = y + height / 2, e = z - depth / 2, f = z + depth / 2
    face([[a, d, e], [a, d, f], [b, d, f], [b, d, e]], [0, 1, 0], color)
    face([[a, c, e], [b, c, e], [b, c, f], [a, c, f]], [0, -1, 0], color)
    face([[a, c, f], [b, c, f], [b, d, f], [a, d, f]], [0, 0, 1], color)
    face([[b, c, e], [a, c, e], [a, d, e], [b, d, e]], [0, 0, -1], color)
    face([[b, c, f], [b, c, e], [b, d, e], [b, d, f]], [1, 0, 0], color)
    face([[a, c, e], [a, c, f], [a, d, f], [a, d, e]], [-1, 0, 0], color)
  }
  const rounded = (x: number, y: number, z: number, width: number, height: number, depth: number, radius: number, color: Vec) => {
    radius = Math.min(radius, width / 2, depth / 2)
    const perimeter: Vec[] = []
    for (let corner = 0; corner < 4; corner++) {
      const angle = corner * Math.PI / 2
      const cx = Math.cos(angle + Math.PI / 4) > 0 ? width / 2 - radius : -width / 2 + radius
      const cz = Math.sin(angle + Math.PI / 4) > 0 ? depth / 2 - radius : -depth / 2 + radius
      for (let step = 0; step <= 6; step++) {
        const theta = angle + step * Math.PI / 12
        perimeter.push([x + cx + Math.cos(theta) * radius, y, z + cz + Math.sin(theta) * radius])
      }
    }
    for (let index = 0; index < perimeter.length; index++) {
      const p = perimeter[index], q = perimeter[(index + 1) % perimeter.length]
      const topP: Vec = [p[0], y + height / 2, p[2]], topQ: Vec = [q[0], y + height / 2, q[2]]
      const bottomP: Vec = [p[0], y - height / 2, p[2]], bottomQ: Vec = [q[0], y - height / 2, q[2]]
      triangle([[x, y + height / 2, z], topQ, topP], [0, 1, 0], color)
      triangle([[x, y - height / 2, z], bottomP, bottomQ], [0, -1, 0], color)
      const nx = q[2] - p[2], nz = p[0] - q[0], length = Math.hypot(nx, nz)
      if (length > .000001) face([bottomP, topP, topQ, bottomQ], [nx / length, 0, nz / length], color)
    }
  }
  const cylinder = (x: number, y: number, z: number, radius: number, height: number, color: Vec) => {
    for (let index = 0; index < 48; index++) {
      const a = index * Math.PI / 24, b = (index + 1) * Math.PI / 24
      const p: Vec = [x + Math.cos(a) * radius, y - height / 2, z + Math.sin(a) * radius]
      const q: Vec = [x + Math.cos(b) * radius, y - height / 2, z + Math.sin(b) * radius]
      const topP: Vec = [p[0], y + height / 2, p[2]], topQ: Vec = [q[0], y + height / 2, q[2]]
      face([p, topP, topQ, q], [Math.cos((a + b) / 2), 0, Math.sin((a + b) / 2)], color)
      triangle([[x, y + height / 2, z], topQ, topP], [0, 1, 0], color)
      triangle([[x, y - height / 2, z], p, q], [0, -1, 0], color)
    }
  }
  const dome = (x: number, y: number, z: number, radius: number, height: number, color: Vec) => {
    for (let row = 0; row < 10; row++) for (let column = 0; column < 32; column++) {
      const point = (r: number, c: number): Vec => {
        const polar = r * Math.PI / 20, angle = c * Math.PI / 16
        return [x + radius * Math.sin(polar) * Math.cos(angle), y + height * Math.cos(polar), z + radius * Math.sin(polar) * Math.sin(angle)]
      }
      const polar = (row + .5) * Math.PI / 20, angle = (column + .5) * Math.PI / 16
      const normal: Vec = [Math.sin(polar) * Math.cos(angle), Math.cos(polar), Math.sin(polar) * Math.sin(angle)]
      face([point(row, column), point(row + 1, column), point(row + 1, column + 1), point(row, column + 1)], normal, color)
    }
  }
  if (kind === 'room') {
    rounded(0, -.12, 0, 4.8, .2, 3.8, .12, colors.floor)
    box(0, .71, -1.83, 4.8, 1.5, .14, colors.paper)
    box(-2.33, .71, 0, .14, 1.5, 3.8, colors.paper)
    for (const x of [-1.05, 1.05]) {
      rounded(x, .01, .2, 1.25, .025, 2.55, .16, colors.shadow)
      rounded(x, .2, .2, 1.1, .36, 2.35, .1, colors.warm)
      rounded(x, .44, .2, 1.09, .15, 2.33, .15, colors.paper)
      rounded(x, .54, .65, 1.09, .055, 1.35, .08, colors.blue)
      rounded(x, .57, -.59, .8, .11, .45, .11, colors.paper)
      box(x, .42, -1.05, 1.14, .83, .085, colors.warm)
    }
    rounded(0, .24, -.92, .53, .48, .57, .045, colors.warm)
    cylinder(0, .63, -.92, .035, .35, colors.metal)
    cylinder(0, .84, -.92, .17, .12, colors.paper)
    rounded(0, .008, 1.45, 1.1, .018, .35, .07, colors.warm)
  } else if (kind === 'meal') {
    rounded(0, .02, 0, 3.85, .16, 2.35, .24, colors.metal)
    rounded(0, .11, 0, 3.6, .015, 2.1, .18, colors.floor)
    cylinder(-.44, .21, 0, .85, .2, colors.paper)
    cylinder(-.44, .315, 0, .73, .015, colors.warm)
    dome(-.69, .33, -.23, .43, .29, colors.paper)
    dome(-.06, .33, -.19, .32, .21, colors.green)
    dome(-.36, .33, .38, .39, .18, colors.food)
    cylinder(1.25, .49, -.26, .31, .74, colors.paper)
    cylinder(1.25, .87, -.26, .26, .015, colors.food)
    box(-1.55, .14, 0, .028, .03, 1.5, colors.dark)
    box(-1.67, .14, 0, .028, .03, 1.5, colors.dark)
  } else if (kind === 'demo') {
    rounded(0, -.05, 0, 4.45, .16, 2.6, .15, colors.warm)
    rounded(0, -.4, 0, 2.2, .55, 1.4, .1, colors.metal)
    rounded(-.4, .11, .17, 2.8, .17, 1.95, .14, colors.dark)
    box(-.4, .49, -.48, .16, .65, .12, colors.metal)
    box(-.4, 1.07, -.55, 2.35, 1.3, .14, colors.dark)
    box(-.4, 1.08, -.468, 2.14, 1.09, .018, colors.blue)
    for (let index = 0; index < 5; index++) {
      const x = -1.23 + index * .39, y = .79 + index % 3 * .12
      box(x, y, -.45, .39, .04, .012, colors.paper)
      if (index < 4) box(x + .175, y + .06, -.449, .04, .13, .012, colors.paper)
    }
    box(-1.03, 1.4, -.449, .42, .035, .012, colors.paper)
    box(-1.1, 1.3, -.449, .28, .025, .012, colors.paper)
    cylinder(-1.27, .3, .68, .14, .12, colors.paper)
    cylinder(-.81, .3, .68, .14, .12, colors.paper)
    cylinder(.37, .32, .65, .22, .16, colors.blue)
    rounded(1.55, .61, .18, .57, 1.15, .1, .08, colors.dark)
    box(1.55, .62, .24, .46, .94, .015, colors.paper)
    for (let index = 0; index < 3; index++) box(1.55, .87 - index * .16, .252, .29, .04, .008, colors.blue)
  } else {
    rounded(0, -.02, 0, 4.5, .15, 2.65, .13, colors.warm)
    for (const x of [-1.88, 1.88]) for (const z of [-.93, .93]) box(x, -.48, z, .09, .85, .09, colors.metal)
    const width = 2.3
    rounded(0, .12, .18, width + .2, .09, 1.25, .1, colors.metal)
    box(0, .74, -.38, width, 1.25, .08, colors.dark)
    box(0, .75, -.332, width - .15, 1.08, .018, colors.blue)
    box(-width * .22, 1.14, -.318, width * .34, .035, .008, colors.paper)
    box(-width * .25, 1.04, -.318, width * .28, .028, .008, colors.paper)
    for (let index = 0; index < 5; index++) box(-.56 + index * .28, .49 + index % 3 * .1, -.313, .19, .15 + index % 3 * .2, .012, colors.paper)
    for (let row = 0; row < 4; row++) for (let column = 0; column < 11; column++) rounded(-.89 + column * .177, .173, -.04 + row * .15, .12, .015, .1, .015, colors.dark)
    rounded(0, .176, .57, .57, .018, .25, .04, colors.floor)
    rounded(-1.65, .15, .05, .72, .08, 1.15, .055, colors.paper)
    for (let index = 0; index < 4; index++) box(-1.65, .195, -.29 + index * .15, .46, .012, .025, colors.blue)
    rounded(1.65, .16, .14, .73, .09, .79, .045, colors.green)
    box(1.65, .25, .14, .3, .09, .32, colors.dark)
    for (let index = 0; index < 4; index++) {
      box(1.45 + index * .135, .22, -.12, .045, .035, .12, colors.metal)
      box(1.45 + index * .135, .22, .4, .045, .035, .12, colors.metal)
    }
  }
  return new Float32Array(vertices)
}
