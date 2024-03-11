import { defs, tiny } from './examples/common.js'
import { Shape_From_File } from './examples/obj-file-demo.js'
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
  Texture,
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
      spaceship: new Shape_From_File(
        '../assets/spaceship.obj'
      ),
      outline: new Cube_Outline(),
      floor: new Floor(),
    }
    this.materials = {
      plastic: new Material(new defs.Phong_Shader(), {
        ambient: 0.4,
        diffusivity: 0.6,
        color: hex_color('#ffffff'),
      }),
      spaceship: new Material(new defs.Textured_Phong(), {
        ambient: 0.0,
        texture: new Texture('assets/mat.png'),
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
    this.play_music = true

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

    // Additional properties for managing cubes
    this.cubeSize = 4 // Sets cube size of player
    this.spawnedCubes = [] // Store the positions and IDs of spawned cubes
    this.spawnRate = 500 // Time in milliseconds between cube spawns
    this.lastSpawnTime = 0 // Last spawn time
    this.cubeSpeed = 25 // Speed at which cubes move towards the player

    this.current_time = performance.now()
  }

  // Method to spawn cubes randomly
  spawnCube() {
    const positionX = Math.random() * 20 - 10 // Random position in X axis, adjust range as needed
    const positionZ = -50 // Start far away on the Z axis
    const cubeID = Math.random().toString(36).substr(2, 9) // Generate a unique ID for each cube
    this.spawnedCubes.push({ positionX, positionZ, cubeID })
  }

  // Method to see if player is colliding
  isColliding(playerPos, cubePos, cubeSize) {
    const distanceX = Math.abs(playerPos.x - cubePos.x)
    const distanceZ = Math.abs(playerPos.z - cubePos.z)
    // Since player does not move in z and y, we only check for x (left/right) and z (forward/backward)
    return distanceX < cubeSize && distanceZ < cubeSize
  }

  resetGame() {
    // Reset game state variables
    this.started = true // Allow the game to run
    this.current_score = 0 // Reset score
    this.high_score = this.high_score // Keep high score, or reset if you prefer
    this.spawnedCubes = [] // Clear existing cubes
    this.horizontal_position = 0 // Reset player position
    this.is_paused = false // Ensure game is not paused

    // Clear any game over UI
    if (this.game_over_container) {
      this.game_over_container.style.display = 'none'
    }

    // Reset spawn timing
    this.lastSpawnTime = performance.now()

    // Any other resets needed (e.g., player health, game level)
    // ...

    // Optionally, refocus or click to start
  }

  showGameOverScreen() {
    if (!this.game_over_container) {
      this.game_over_container =
        document.createElement('div')
      this.game_over_container.style.position = 'absolute'
      this.game_over_container.style.top = '30%'
      this.game_over_container.style.left = '50%'
      this.game_over_container.style.transform =
        'translate(-50%, -50%)'
      this.game_over_container.style.fontSize = '80px'
      this.game_over_container.style.color = 'white'
      this.game_over_container.style.textAlign = 'center'
      this.game_over_container.style.zIndex = '1000' // Ensure it's on top
      document.body.appendChild(this.game_over_container)

      // "Play Again" button
      this.play_again_button =
        document.createElement('button')
      this.play_again_button.textContent = 'Play Again'
      this.play_again_button.style.marginTop = '20px'
      this.play_again_button.style.padding = '15px 80px'
      this.play_again_button.style.fontSize = '24px'
      this.play_again_button.style.backgroundColor =
        'transparent'
      this.play_again_button.style.color = 'white'
      this.play_again_button.style.border =
        '3px solid white'
      this.play_again_button.style.borderRadius = '30px'
      this.play_again_button.style.cursor = 'pointer'
      this.play_again_button.onclick = () => {
        this.resetGame()
      }
      this.game_over_container.appendChild(
        this.play_again_button
      )
    }

    this.game_over_container.innerHTML = `GAME OVER <br/>`
    this.game_over_container.appendChild(
      this.play_again_button
    ) // Re-add the button since innerHTML would remove it
    this.game_over_container.style.display = 'block' // Make sure it's visible
  }

  make_control_panel() {
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

    this.key_triggered_button(
      'Play/Pause Music',
      ['m'],
      () => {
        this.play_music = !this.play_music
      }
    )

    this.key_triggered_button('Outline', ['o'], () => {
      this.outline = !this.outline
    })
  }

  display(context, program_state) {
    super.display(context, program_state)

    // Background audio
    if (!this.music) {
      this.music = document.createElement('audio')
      this.music.id = 'background-music'
      this.music.autoplay = true
      this.music.loop = true
      this.music.src = 'backinshape.mp4'
      document.body.appendChild(this.music)
    }

    if (this.play_music) {
      this.music.play()
    } else {
      this.music.pause()
    }

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
        this.start_button.textContent = 'Play'
        this.start_button.style.position = 'absolute'
        this.start_button.style.top = '50%'
        this.start_button.style.left = '50%'
        this.start_button.style.transform =
          'translate(-50%, -50%)'
        this.start_button.style.padding = '15px 80px'
        this.start_button.style.fontSize = '24px'
        this.start_button.style.backgroundColor =
          'transparent'
        this.start_button.style.color = 'white'
        this.start_button.style.border = '3px solid white'
        this.start_button.style.borderRadius = '30px'
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
      } else {
        this.current_time = performance.now()
      }

      // Cube spawning logic
      const now = this.current_time
      if (now - this.lastSpawnTime > this.spawnRate) {
        this.spawnCube()
        this.lastSpawnTime = now
      }

      // Move and draw spawned cubes
      if (!this.is_paused) {
        this.spawnedCubes.forEach((cube) => {
          cube.positionZ +=
            (this.cubeSpeed *
              program_state.animation_delta_time) /
            1000 // Move cube towards player
        })
      }

      this.spawnedCubes.forEach((cube, index) => {
        let playerPos = {
          x: this.horizontal_position,
          z: 0,
        } // Z is always 0 since we're assuming it's a fixed lane
        let cubePos = {
          x: cube.positionX,
          z: cube.positionZ,
        }

        if (
          this.isColliding(
            playerPos,
            cubePos,
            this.cubeSize / 2
          )
        ) {
          // Assuming the cubeSize refers to the full side length; we want radius
          // TODO: Can comment out this.started = false and instead implement the following:
          // Pause score
          // All cubes stop moving
          // Collision graphics
          this.started = false // Stop the game
          // Optionally, perform any cleanup or display a game over message
          this.showGameOverScreen() // Show game over screen instead of the alert
          return // Exit the loop to avoid further processing
        }
      })

      this.spawnedCubes.forEach((cube) => {
        if (cube.positionZ < 20) {
          // Check if cube is within visible range before drawing
          const cubeTransform = Mat4.translation(
            cube.positionX,
            0,
            cube.positionZ
          )
          if (this.outline) {
            this.shapes.outline.draw(
              context,
              program_state,
              cubeTransform,
              this.white,
              'LINES'
            )
          } else {
            this.shapes.cube.draw(
              context,
              program_state,
              cubeTransform,
              this.materials.plastic.override({
                color: hex_color('#f1a593'),
              })
            )
          }
        }
      })

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
      this.shapes.spaceship.draw(
        context,
        program_state,
        cube_transform
          .times(
            Mat4.rotation(this.tilt_angle * 10, 0, 0, 1)
          )
          .times(Mat4.rotation(Math.PI, 0, 1, 0))
          .times(Mat4.scale(1.4, 1.4, 1.4)),
        this.materials.spaceship
      )

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
      // Fix positioning so it's consistently in the upper right of the canvas
      this.score_container.style.position = 'absolute'
      this.score_container.style.right = '5px' // Keep score 5px from the right edge of the canvas
      this.score_container.style.top = '5px' // Keep score 5px from the top edge of the canvas
      this.score_container.style.color = 'white'
      this.score_container.style.fontSize = '20px'
      this.score_container.style.textAlign = 'right'
      this.score_container.style.zIndex = '1000' // Make sure it's on top

      // Append the score container to the WebGL canvas created by Canvas_Widget
      const canvasElement =
        document.querySelector('#main-canvas') // Select the main canvas element
      canvasElement.style.position = 'relative' // Ensure the canvas is positioned to anchor the score
      canvasElement.appendChild(this.score_container)

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
