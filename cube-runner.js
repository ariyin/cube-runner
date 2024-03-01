import { defs, tiny } from './examples/common.js'

const {
  Vector,
  Vector3,
  vec,
  vec3,
  vec4,
  color,
  hex_color,
  Matrix,
  Mat4,
  Light,
  Shape,
  Material,
  Scene,
} = tiny

class Cube extends Shape {
  constructor() {
    super('position', 'normal')
    // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
    this.arrays.position = Vector3.cast(
      [-1, -1, -1],
      [1, -1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, -1],
      [-1, 1, -1],
      [1, 1, 1],
      [-1, 1, 1],
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, -1, 1],
      [1, -1, -1],
      [1, 1, 1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1],
      [1, -1, -1],
      [-1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1]
    )
    this.arrays.normal = Vector3.cast(
      [0, -1, 0],
      [0, -1, 0],
      [0, -1, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [-1, 0, 0],
      [-1, 0, 0],
      [-1, 0, 0],
      [-1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1]
    )
    // Arrange the vertices into a square shape in texture space too:
    this.indices.push(
      0,
      1,
      2,
      1,
      3,
      2,
      4,
      5,
      6,
      5,
      7,
      6,
      8,
      9,
      10,
      9,
      11,
      10,
      12,
      13,
      14,
      13,
      15,
      14,
      16,
      17,
      18,
      17,
      19,
      18,
      20,
      21,
      22,
      21,
      23,
      22
    )
  }
}

class Cube_Outline extends Shape {
  constructor() {
    super('position', 'color')
    this.arrays.position = Vector3.cast(
      [-1, 1, 1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, 1, 1],
      [-1, -1, 1],
      [-1, -1, 1],
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, 1, -1],
      [-1, -1, -1],
      [1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [1, 1, 1],
      [1, -1, 1],
      [1, -1, 1],
      [1, -1, -1],
      [1, -1, 1],
      [-1, -1, 1]
    )
    this.arrays.color = [
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
      vec4(1, 1, 1, 1),
    ]
    this.indices = false
  }
}

class Floor extends Shape {
  constructor() {
    super('position', 'normal')
    // Define vertex positions for a simple floor plane
    this.arrays.position = Vector3.cast(
      [-100, 0, -50],
      [100, 0, -50],
      [-100, 0, 50],
      [100, 0, 50]
    )
    // Define normals for the floor plane
    this.arrays.normal = Vector3.cast(
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    )
    // Define indices to form triangles from the vertices
    this.indices.push(0, 1, 2, 1, 3, 2)
  }
}

// A Scene that can be added to any display canvas.
// Setup the shapes, materials, camera, and lighting here.
class Base_Scene extends Scene {
  constructor() {
    super()
    this.shapes = {
      cube: new Cube(),
      outline: new Cube_Outline(),
      floor: new Floor(),
    }
    this.materials = {
      plastic: new Material(new defs.Phong_Shader(), {
        ambient: 0.4,
        diffusivity: 0.6,
        color: hex_color('#ffffff'),
      }),
    }
    // The white material and basic shader are used for drawing the outline.
    this.white = new Material(new defs.Basic_Shader())
  }

  // Called once per frame of animation. Here, the base class's display only does some initial setup.
  display(context, program_state) {
    // Lights
    const light_position = vec4(0, 20, 5, 1)
    program_state.lights = [
      new Light(light_position, color(1, 1, 1, 1), 1000),
    ]
  }
}

/**
 * This Scene object can be added to any display canvas.
 * We isolate that code so it can be experimented with on its own.
 * This gives you a very small code sandbox for editing a simple scene, and for
 * experimenting with matrix transformations.
 */
export class CubeRunner extends Base_Scene {
  constructor() {
    super()

    // Game
    this.started = false
    this.current_score = 0
    this.high_score = 0
    this.is_paused = false

    // User
    this.outline = false
    this.left_key_pressed = false
    this.right_key_pressed = false
    this.horizontal_position = 0
    this.speed = 12

    // Camera tilt
    this.tilt_angle = 0
    this.tilt_speed = 0.05
    this.tilt_acceleration = 0.005
    this.max_tilt_speed = 0.1
    this.max_tilt_angle = Math.PI / 20
  }

  make_control_panel() {
    // this.key_triggered_button("Outline", ["o"], () => {
    //     this.outline = !this.outline;
    // });

    // TODO: Shouldn't be the cube/user moving, but the scene moving
    this.key_triggered_button(
      'Left',
      ['a'],
      () => {
        this.left_key_pressed = true
      },
      undefined,
      () => {
        this.left_key_pressed = false
      }
    )
    this.key_triggered_button(
      'Right',
      ['d'],
      () => {
        this.right_key_pressed = true
      },
      undefined,
      () => {
        this.right_key_pressed = false
      }
    )

    this.key_triggered_button('Pause', ['p'], () => {
      this.is_paused = !this.is_paused
    })
  }

  display(context, program_state) {
    super.display(context, program_state)

    if (!this.started) {
      // Starting screen
      if (!this.start_title) {
        this.start_title = document.createElement('div')
        this.start_title.textContent = 'Cube Runner'
        this.start_title.style.color = 'white'
        this.start_title.style.position = 'absolute'
        this.start_title.style.top = '20%'
        this.start_title.style.left = '50%'
        this.start_title.style.transform =
          'translate(-50%, -50%)'
        this.start_title.style.fontSize = '80px'
        document.body.appendChild(this.start_title)
      }
      if (!this.start_button) {
        this.start_button = document.createElement('button')
        this.start_button.textContent = 'Start'
        this.start_button.style.position = 'absolute'
        this.start_button.style.top = '50%'
        this.start_button.style.left = '50%'
        this.start_button.style.transform =
          'translate(-50%, -50%)'
        this.start_button.style.padding = '10px 20px'
        this.start_button.style.fontSize = '18px'
        this.start_button.style.cursor = 'pointer'
        this.start_button.onclick = () => {
          this.started = true
        }
        document.body.appendChild(this.start_button)
      }
    } else {
      // Gameplay
      // Clear start screen
      if (this.start_title) {
        this.start_title.style.display = 'none'
      }
      if (this.start_button) {
        this.start_button.style.display = 'none'
      }

      let dt = program_state.animation_delta_time / 1000

      if (this.is_paused) {
        dt = 0
      }

      // Adjust tilt angle based on user input
      // TODO: exponentiate the tilt speed
      if (this.left_key_pressed) {
        this.horizontal_position -= this.speed * dt
        this.tilt_angle =
          this.tilt_angle - this.tilt_speed * dt
      } else if (this.right_key_pressed) {
        this.horizontal_position += this.speed * dt
        this.tilt_angle =
          this.tilt_angle + this.tilt_speed * dt
      } else {
        // Gradually return tilt angle to zero when no button is pressed
        if (this.tilt_angle > 0) {
          this.tilt_angle = Math.max(
            0,
            this.tilt_angle - this.tilt_speed * dt
          )
        } else if (this.tilt_angle < 0) {
          this.tilt_angle = Math.min(
            0,
            this.tilt_angle + this.tilt_speed * dt
          )
        }
      }

      // cap the maximum tilt angle
      this.tilt_angle = Math.max(
        Math.min(this.tilt_angle, Math.PI / 72),
        -Math.PI / 72
      )

      let cube_transform = Mat4.translation(
        this.horizontal_position,
        0,
        0
      )

      let camera_position = Mat4.inverse(
        Mat4.translation(0, 5, 30)
          .times(Mat4.rotation(-this.tilt_angle, 0, 0, 1))
          .times(cube_transform)
      )

      program_state.set_camera(camera_position)
      program_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        context.width / context.height,
        1,
        100
      )

      // Transformation of floor and user
      let floor_transform = Mat4.identity().times(
        Mat4.translation(0, -1, 0)
      )
      // Draw floor and user
      this.shapes.floor.draw(
        context,
        program_state,
        floor_transform,
        this.materials.plastic.override({
          color: color(0.2, 0.2, 0.2, 1),
        })
      )
      this.shapes.cube.draw(
        context,
        program_state,
        cube_transform,
        this.materials.plastic.override({
          color: hex_color('#1a9ffa'),
        })
      )

      //background cubes for demo
      for (let i = 0; i < 10; i++) {
        this.shapes.cube.draw(
          context,
          program_state,
          Mat4.translation((i - 5) * 5, 0, -10),
          this.materials.plastic.override({
            color: hex_color('#f1a593'),
          })
        )
      }

      // Update and render score
      if (!this.is_paused) {
        this.update_score(
          program_state.animation_delta_time / 10
        )
      }
      this.render_score()
    }
  }

  update_score(delta_time) {
    // Update the current score, typically based on the delta_time
    this.current_score += delta_time // for example, increment score by time

    // Check and update high score if current score is greater
    if (this.current_score > this.high_score) {
      this.high_score = this.current_score
    }
  }

  render_score() {
    // Ensure the DOM element for the score exists
    if (!this.score_container) {
      this.score_container = document.createElement('div')
      // TODO: Fix positioning so it's within the canvas div
      this.score_container.style.position = 'absolute'
      this.score_container.style.right = '23%'
      this.score_container.style.top = '5%'
      this.score_container.style.transform =
        'translate(-50%, -50%)'
      this.score_container.style.color = 'white'
      this.score_container.style.fontSize = '20px'
      this.score_container.style.textAlign = 'right'
      // TEMP FOR DEBUGGING
      this.score_container.style.backgroundColor = 'black'
      document.body.appendChild(this.score_container)

      this.high_score_element =
        document.createElement('div')
      this.score_container.appendChild(
        this.high_score_element
      )

      this.current_score_element =
        document.createElement('div')
      this.score_container.appendChild(
        this.current_score_element
      )
    }

    // Update the score and high score displays
    this.high_score_element.textContent = `High Score: ${Math.floor(
      this.high_score
    )}`
    this.current_score_element.textContent = `Score: ${Math.floor(
      this.current_score
    )}`
  }
}
