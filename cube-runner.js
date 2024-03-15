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

const { Cube, Textured_Phong } = defs

class Cube_Outline extends Shape {
  constructor(color) {
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
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
      color,
    ]
    this.indices = false
  }
}

// A Scene that can be added to any display canvas.
// Setup the shapes, materials, camera, and lighting here.
class Base_Scene extends Scene {
  constructor() {
    super()

    const initial_corner_point = vec3(-31, -12.5, -50)
    // const initial_corner_point = vec3(-31, -12.87, -50);
    const row_operation = (s, p) =>
      p
        ? Mat4.translation(0, 0.3, 0).times(p.to4(1)).to3()
        : initial_corner_point
    const column_operation = (t, p) =>
      Mat4.translation(0.3, 0, 0).times(p.to4(1)).to3()

    this.shapes = {
      cube: new Cube(),
      spaceship: new Shape_From_File(
        '../assets/spaceship.obj'
      ),
      shield: new defs.Subdivision_Sphere(4),
      outline: new Cube_Outline(hex_color('#fdaf42')),
      green_outline: new Cube_Outline(hex_color('#00ff00')),
      floor: new Cube(),
      background: new defs.Grid_Patch(
        300,
        400,
        row_operation,
        column_operation
      ),
    }

    this.materials = {
      plastic: new Material(new defs.Phong_Shader(), {
        ambient: 0.8,
        diffusivity: 0.5,
        color: hex_color('#ffffff'),
      }),
      shield: new Material(new defs.Phong_Shader(), {
        ambient: 1.0,
        color: vec4(0, 1, 0, 0.3),
      }),
      spaceship: new Material(new defs.Textured_Phong(), {
        ambient: 0.0,
        texture: new Texture('assets/mat.png'),
        color: hex_color('#ffffff'),
      }),
      synthwave: new Material(new Texture_Scroll_X(), {
        ambient: 1,
        texture: new Texture(
          'assets/synthwave.png',
          'NEAREST'
        ),
        color: hex_color('#000000'),
      }),
      bluegrid: new Material(new Texture_Scroll_X(), {
        ambient: 1,
        texture: new Texture(
          'assets/bluegrid.png',
          'NEAREST'
        ),
        color: hex_color('#000000'),
      }),
      sky: new Material(new Texture_Scroll_X(), {
        ambient: 1,
        texture: new Texture('assets/sky.png', 'NEAREST'),
        color: hex_color('#000000'),
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
    this.theme = 'Basic' // basic, synthwave, sky

    // User
    this.left_key_pressed = false
    this.right_key_pressed = false
    this.horizontal_position = 0
    this.speed = 12

    // Camera tilt
    this.tilt_angle = 0
    this.tilt_speed = 0.2
    this.tilt_acceleration = 0.005

    // Additional properties for managing cubes
    this.cubeSize = 4 // Sets cube size of player
    this.spawnedCubes = [] // Store the positions and IDs of spawned cubes
    this.spawnRate = 50 // Time in milliseconds between cube spawns
    this.lastSpawnTime = 0 // Last spawn time
    this.cubeSpeed = 25 // Speed at which cubes move towards the player

    this.current_time = performance.now()

    this.difficulty = 'Medium'
    this.achievements = [
      { score: 100, achieved: false },
      { score: 200, achieved: false },
      { score: 500, achieved: false },
      { score: 1000, achieved: false },
      { score: 2000, achieved: false },
      { score: 5000, achieved: false },
      { score: 10000, achieved: false },
    ]
    this.currentAchievement = null // To store the currently displayed achievement

    // Define placeholder high scores with names
    this.placeholderScores = [
      { name: 'Giannis', score: 10000 },
      { name: 'AK@$', score: 9000 },
      { name: 'ASTEROID MASTER', score: 8000 },
      { name: 'JDCR', score: 7000 },
      { name: 'Majin', score: 6000 },
      { name: 'ThatOneDude001', score: 5000 },
      { name: 'pandalover234', score: 4000 },
      { name: 'beatmel0ser', score: 3000 },
      { name: 'Nick', score: 2000 },
      { name: 'Aneesh', score: 500 },
    ]

    this.hasShield = false; // Track if the player has collected a shield power-up
    this.shieldActive = false; // Track if the shield is currently active
    this.shield_duration = 2.5
    this.shield_cube_chance = 0.03
    this.shield_activate_time = -this.shield_duration
  }

  // Method to spawn cubes randomly
  spawnCube() {
    // Generate a position X based on the player's current position
    // This could be a random value within a range that moves with the player
    const range = 40 // The range to the left and right of the player to spawn cubes
    const positionX =
      this.horizontal_position +
      (Math.random() - 0.5) * 2 * range

    // Keep the Z position as it determines how far ahead cubes spawn
    const positionZ = -50 // Start far away on the Z axis to move towards the player

    // Generate a unique ID for each cube for identification
    const cubeID = Math.random().toString(36).substr(2, 9)

    const isShield = Math.random() < this.shield_cube_chance

    // Push the new cube into the spawnedCubes array with its calculated positions
    this.spawnedCubes.push({
      positionX,
      positionZ,
      cubeID,
      isShield,
      isActive: true,
    })
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
    this.hasShield = false; // Make sure no shield is available upon reset
    this.updatePowerUpDisplay(); // Update the power-up display
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
  }

  showHighScoreEntry() {
    const overlay = this.createOverlay();

    const title = document.createElement('h2');
    title.textContent = 'CONGRATULATIONS!';
    overlay.modal.appendChild(title);

    const scoreDisplay = document.createElement('h3');
    // scoreDisplay.fontSize = '18px';
    scoreDisplay.textContent = `YOU SCORED ${Math.round(this.current_score)} POINTS! ENTER YOUR NAME:`;
    overlay.modal.appendChild(scoreDisplay);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'YOUR NAME HERE';
    nameInput.style.fontFamily = 'Shapiro';
    nameInput.style.fontSize = '18px';
    nameInput.style.padding = '15px 15px'
    nameInput.style.border = '3px solid black'
    nameInput.style.borderRadius = '30px'
    nameInput.style.width = '300px';
    overlay.modal.appendChild(nameInput);

    const submitStyle = `padding: 5px 15px; font-size: 16px; margin: 5px; background-color: #333; color: white; border: 3px solid #333; border-radius: 5px;`;
    const cancelStyle = `padding: 5px 15px; font-size: 16px; margin: 5px; color: #333; border: 3px solid #333; border-radius: 5px;`;
    
    // Create a new div to contain the buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.paddingTop = '25px';
    
    const submitButton = document.createElement('button');
    submitButton.textContent = 'SUBMIT';
    submitButton.setAttribute('style', submitStyle);
    submitButton.onclick = () => {
      const userName = nameInput.value.trim();
      if (userName) {
        // Assuming a method to save the score
        this.saveScore(userName, this.current_score);
        document.body.removeChild(overlay.container);
        this.showLeaderboard(); // Show the leaderboard after submitting
      }
    };
    buttonsDiv.appendChild(submitButton); // Append submit button to the div
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'CANCEL';
    cancelButton.setAttribute('style', cancelStyle);
    cancelButton.onclick = () => {
      document.body.removeChild(overlay.container);
    };
    buttonsDiv.appendChild(cancelButton); // Append cancel button to the div
  
    overlay.modal.appendChild(buttonsDiv); // Append the div containing buttons to the overlay modal
    document.body.appendChild(overlay.container);
  }

  // Step 2: Display the Leaderboard
  showLeaderboard() {
    const overlay = this.createOverlay();
    const title = document.createElement('h2');
    title.textContent = 'Leaderboard';
    overlay.modal.appendChild(title);

    // Assuming you have a method to get sorted leaderboard scores
    const scores = this.getLeaderboardScores();

    const list = document.createElement('ol');
    scores.forEach(score => {
      const item = document.createElement('li');
      item.textContent = `${score.name}: ${score.score}`;
      list.appendChild(item);
    });
    overlay.modal.appendChild(list);

    const closeStyle = `padding: 5px 15px; font-size: 16px; margin: 5px; background-color: #333; color: white; border: 3px solid #333; border-radius: 5px;`;
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.setAttribute('style', closeStyle);
    closeButton.onclick = () => {
      document.body.removeChild(overlay.container);
    };
    overlay.modal.appendChild(closeButton);

    document.body.appendChild(overlay.container);
  }

  // Utility to create overlay and modal
  createOverlay() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = 0;
    container.style.top = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    const modal = document.createElement('div');
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.textAlign = 'center';
    modal.style.maxWidth = '600px';
    modal.style.width = '80%';

    container.appendChild(modal);

    return { container, modal };
  }

  saveScore(name, score) {
    // Round the score to the nearest whole number before saving
    const roundedScore = Math.round(score);

    // Add the new score
    this.placeholderScores.push({ name, score: roundedScore - 1});

    // Sort the scores in descending order
    this.placeholderScores.sort((a, b) => b.score - a.score);

    // Optional: Keep only the top 10 scores
    this.placeholderScores = this.placeholderScores.slice(0, 10);

    // Since we've modified the placeholderScores array directly,
    // the next call to showLeaderboard will automatically display the updated scores.
  }

  updatePowerUpDisplay() {
    if (!this.powerUpContainer) {
      // Create the container for the power-up display if it doesn't already exist
      this.powerUpContainer = document.createElement('div');
      this.powerUpContainer.style.position = 'absolute';
      this.powerUpContainer.style.left = '20px'; // Position at the bottom-left corner
      this.powerUpContainer.style.top = '475px';
      this.powerUpContainer.style.width = '50px'; // Adjust size as needed
      this.powerUpContainer.style.height = '50px';
      // document.body.appendChild(this.powerUpContainer);

      const canvasElement =
        document.querySelector('#main-canvas') // Select the main canvas element
      canvasElement.style.position = 'relative' // Ensure the canvas is positioned to anchor the score
      canvasElement.appendChild(this.powerUpContainer)

      // Create the image element for the shield icon
      this.shieldIcon = document.createElement('img');
      this.shieldIcon.src = 'assets/shield.png'; // Use the specified path
      this.shieldIcon.style.width = '200%'; // Make the icon fill the container
      this.shieldIcon.style.height = '200%';
      this.shieldIcon.style.display = 'none'; // Initially hidden
      this.powerUpContainer.appendChild(this.shieldIcon);
    }

    // Ensure the power-up display responds to game state changes
    if (!this.started || this.game_over) {
      // Hide the power-up display when the game is not running or is over
      this.powerUpContainer.style.display = 'none';
    } else {
      // Only show the power-up display if the game is running and the player has a shield
      this.powerUpContainer.style.display = this.hasShield ? 'block' : 'none';
      this.shieldIcon.style.display = this.hasShield ? 'block' : 'none';
    }
  }

  getLeaderboardScores() {
    // Return a sorted list of score objects {name: 'Player', score: 100}
    return this.placeholderScores;
  }


  // Checks if the score qualifies as a high score
  isNewHighScore(currentScore) {
    // Check if the current score is higher than the lowest score in the leaderboard
    return this.placeholderScores.length < 10 || currentScore > this.placeholderScores[this.placeholderScores.length - 1].score;
  }

  // Prompts user for their name if they got a high score
  promptForHighScoreName() {
    this.showHighScoreEntry();
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
    }

    // Setup Leaderboards button if not already done
    if (!this.leaderboards_button) {
      this.leaderboards_button =
        document.createElement('button')
      this.leaderboards_button.textContent = 'Leaderboards'
      this.leaderboards_button.style.padding = '10px 20px'
      this.leaderboards_button.style.fontSize = '18px'
      this.leaderboards_button.style.backgroundColor =
        '#808080' // Feel free to customize the color
      this.leaderboards_button.style.color = 'white'
      this.leaderboards_button.style.border = 'none'
      this.leaderboards_button.style.borderRadius = '5px'
      this.leaderboards_button.style.cursor = 'pointer'
      this.leaderboards_button.style.marginTop = '20px' // Adjust as needed based on layout
      this.leaderboards_button.style.marginRight = '5px'
      this.leaderboards_button.style.transition =
        'background-color 0.3s'

      this.leaderboards_button.onmouseover = function () {
        this.style.backgroundColor = '#A020F0' // Darker shade for hover, adjust as needed
      }
      this.leaderboards_button.onmouseout = function () {
        this.style.backgroundColor = '#808080' // Change back to grey
      }

      // Append the "Leaderboards" button
      this.game_over_container.appendChild(
        this.leaderboards_button
      )
    }

    // Assign click event to the leaderboards button to show the leaderboard
    this.leaderboards_button.onclick = () => {
      this.showLeaderboard()
    }

    if (this.music) {
      this.music.pause()
      document.body.removeChild(this.music)
      this.music = null
    }

    // Clear previous content
    this.game_over_container.innerHTML = ''

    if (this.achievement_container) {
      this.achievement_container.style.display = 'none'
    }
    if (this.achievement_title) {
      this.achievement_title.style.display = 'none'
    }

    // Create and add game over text
    const gameOverText = document.createElement('div')
    gameOverText.textContent = 'GAME OVER'
    this.game_over_container.appendChild(gameOverText)

    // Display the current score
    const currentScoreText = document.createElement('div')
    currentScoreText.textContent = `YOUR SCORE: ${Math.floor(
      this.current_score
    )}`
    currentScoreText.style.fontSize = '24px' // Customize as needed
    currentScoreText.style.color = 'white' // Customize as needed
    this.game_over_container.appendChild(currentScoreText)

    // Display the best score
    const bestScoreText = document.createElement('div')
    bestScoreText.textContent = `BEST SCORE: ${Math.floor(
      this.high_score
    )}`
    bestScoreText.style.fontSize = '24px' // Customize as needed
    bestScoreText.style.color = 'gold' // Customize as needed
    this.game_over_container.appendChild(bestScoreText)

    // In your game over or score handling logic
    if (this.isNewHighScore(this.current_score)) {
      this.promptForHighScoreName();
    }

    // Check if "Play Again" button already exists
    if (!this.play_again_button) {
      this.play_again_button =
        document.createElement('button')
      this.play_again_button.textContent = 'Play Again'
      this.play_again_button.style.marginTop = '20px'
      // Set up styling as before
      this.play_again_button.onclick = () => {
        this.resetGame()
      }
    }

    // Apply styles to "Play Again" button
    this.play_again_button.style.padding = '10px 20px'
    this.play_again_button.style.fontSize = '18px'
    this.play_again_button.style.backgroundColor = '#808080'
    this.play_again_button.style.color = 'white'
    this.play_again_button.style.border = 'none'
    this.play_again_button.style.borderRadius = '5px'
    this.play_again_button.style.cursor = 'pointer'
    this.play_again_button.style.marginTop = '10px'
    this.play_again_button.style.marginRight = '5px'
    this.play_again_button.style.transition =
      'background-color 0.3s'

    this.play_again_button.onmouseover = function () {
      this.style.backgroundColor = '#45a049'
    }
    this.play_again_button.onmouseout = function () {
      this.style.backgroundColor = '#808080' // Change back to grey
    }

    // Append the "Play Again" button
    this.game_over_container.appendChild(
      this.play_again_button
    )

    // Check if "EXIT TO MAIN MENU" button already exists
    if (!this.exit_to_main_menu_button) {
      this.exit_to_main_menu_button =
        document.createElement('button')
      this.exit_to_main_menu_button.textContent =
        'Main Menu'
      this.exit_to_main_menu_button.onclick = () => {
        this.showMainMenu()
      }
    }

    // Apply styles to "EXIT TO MAIN MENU" button
    this.exit_to_main_menu_button.style.padding =
      '10px 20px'
    this.exit_to_main_menu_button.style.fontSize = '18px'
    this.exit_to_main_menu_button.style.backgroundColor =
      '#808080'
    this.exit_to_main_menu_button.style.color = 'white'
    this.exit_to_main_menu_button.style.border = 'none'
    this.exit_to_main_menu_button.style.borderRadius = '5px'
    this.exit_to_main_menu_button.style.cursor = 'pointer'
    this.exit_to_main_menu_button.style.marginTop = '20px'
    this.exit_to_main_menu_button.style.marginRight = '5px'

    this.exit_to_main_menu_button.style.transition =
      'background-color 0.3s'

    this.exit_to_main_menu_button.onmouseover =
      function () {
        this.style.backgroundColor = '#d32f2f'
      }
    this.exit_to_main_menu_button.onmouseout = function () {
      this.style.backgroundColor = '#808080' // Change back to grey
    }

    // Append the "EXIT TO MAIN MENU" button
    this.game_over_container.appendChild(
      this.exit_to_main_menu_button
    )

    // Check if "Leaderboards" button already exists
    if (!this.leaderboards_button) {
      this.leaderboards_button =
        document.createElement('button')
      this.leaderboards_button.textContent = 'Leaderboards'
      // Add any additional functionality for the leaderboards button
      this.leaderboards_button.onclick = () => {
        console.log('Leaderboards clicked') // Placeholder functionality
      }
    }

    // Apply styles to "Leaderboards" button
    this.leaderboards_button.style.padding = '10px 20px'
    this.leaderboards_button.style.fontSize = '18px'
    this.leaderboards_button.style.backgroundColor =
      '#808080' // Feel free to customize the color
    this.leaderboards_button.style.color = 'white'
    this.leaderboards_button.style.border = 'none'
    this.leaderboards_button.style.borderRadius = '5px'
    this.leaderboards_button.style.cursor = 'pointer'
    this.leaderboards_button.style.marginTop = '20px' // Adjust as needed based on layout
    this.leaderboards_button.style.marginRight = '5px'
    this.leaderboards_button.style.transition =
      'background-color 0.3s'

    this.leaderboards_button.onmouseover = function () {
      this.style.backgroundColor = '#A020F0' // Darker shade for hover, adjust as needed
    }
    this.leaderboards_button.onmouseout = function () {
      this.style.backgroundColor = '#808080' // Change back to grey
    }

    // Append the "Leaderboards" button
    this.game_over_container.appendChild(
      this.leaderboards_button
    )

    // Display the container
    this.game_over_container.style.display = 'block'
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

    this.key_triggered_button("Activate Shield", [" "], () => {
      if (this.hasShield && !this.shieldActive) {
        this.shieldActive = true;
        this.shield_activate_time = performance.now() / 1000; // Current time in seconds
        this.hasShield = false; // Use up the shield power-up
        this.updatePowerUpDisplay(); // Ensure the UI is updated
      }
    });

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
  }

  display(context, program_state) {
    super.display(context, program_state)

    // Hide score container when not in game
    if (!this.started && this.score_container) {
      this.score_container.style.display = 'none'
    } else if (!this.started && this.score_container) {
      // Game is not started, hide the score container
      this.score_container.style.display = 'none'
    }

    if (!this.started) {
      // Starting screen
      if (!this.lobbyMusic) {
        this.lobbyMusic = document.createElement('audio')
        this.lobbyMusic.id = 'background-music'
        this.lobbyMusic.autoplay = true
        this.lobbyMusic.loop = true
        this.lobbyMusic.src = 'audio/lastsurprise.mp3'
        document.body.appendChild(this.lobbyMusic)
      }

      if (this.play_music) {
        this.lobbyMusic.play()
      } else {
        this.lobbyMusic.pause()
      }

      if (!this.start_title) {
        this.start_title = document.createElement('div')
        this.start_title.textContent = 'CUBE RUNNER'
        this.start_title.style.color = 'white'
        this.start_title.style.position = 'absolute'
        this.start_title.style.top = '10%'
        this.start_title.style.left = '50%'
        this.start_title.style.transform =
          'translate(-50%, -50%)'
        this.start_title.style.fontSize = '64px'
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

      // Difficulty selection buttons setup
      if (!this.difficultyButtonsAdded) {
        const buttonStyles = `padding: 5px 15px; font-size: 16px; margin: 5px; background-color: #333; color: white; border: 2px solid white; border-radius: 5px; cursor: pointer;`
        const difficulties = ['Easy', 'Medium', 'Hard']
        this.difficultyContainer =
          document.createElement('div') // Assign it to this.difficultyContainer
        this.difficultyContainer.style.display = 'flex'
        this.difficultyContainer.style.justifyContent =
          'center'
        this.difficultyContainer.style.position = 'absolute'
        this.difficultyContainer.style.top = '40%'
        this.difficultyContainer.style.left = '50%'
        this.difficultyContainer.style.transform =
          'translate(-50%, -50%)'

        let selectedButton = null

        difficulties.forEach((difficulty) => {
          const difficultyButton =
            document.createElement('button')
          difficultyButton.innerText = difficulty
          difficultyButton.setAttribute(
            'style',
            buttonStyles
          )

          if (difficulty === 'Medium') {
            selectedButton = difficultyButton
            selectedButton.style.color = 'black'
            selectedButton.style.backgroundColor = 'white'
          }

          difficultyButton.onclick = () => {
            if (selectedButton) {
              selectedButton.style.color = 'white'
              selectedButton.style.backgroundColor = '#333'
            }
            this.difficulty = difficulty
            switch (difficulty) {
              case 'Easy':
                this.cubeSpeed = 15
                this.spawnRate = 100
                break
              case 'Medium':
                this.cubeSpeed = 25
                this.spawnRate = 50
                break
              case 'Hard':
                this.cubeSpeed = 100
                this.spawnRate = 45
                break
              default:
                this.cubeSpeed = 25 // Default to Medium if something goes wrong
                this.spawnRate = 50
            }
            difficultyButton.style.color = 'black'
            difficultyButton.style.backgroundColor = 'white'
            selectedButton = difficultyButton
            console.log(`Difficulty set to ${difficulty}`)
          }
          this.difficultyContainer.appendChild(
            difficultyButton
          )
        })

        document.body.appendChild(this.difficultyContainer)
        this.difficultyButtonsAdded = true
      }

      let url = ''

      if (this.theme === 'Basic') {
        url = 'assets/basictn.png'
      } else if (this.theme === 'Synthwave') {
        url = 'assets/synthwavetn.png'
      } else if (this.theme === 'Sky') {
        url = 'assets/skytn.png'
      }

      if (!this.themeImagesAdded) {
        this.themeImage = document.createElement('img')
        this.themeImage.style.position = 'absolute'
        this.themeImage.style.top = '24%'
        this.themeImage.style.left = '50%'
        this.themeImage.style.transform =
          'translate(-50%, -50%)'
        this.themeImage.style.width = '275px'
        document.body.appendChild(this.themeImage)
        this.themeImagesAdded = true
      }

      this.themeImage.src = url

      // Theme selection buttons setup
      if (!this.themeButtonsAdded) {
        const buttonStyles = `padding: 5px 15px; font-size: 16px; margin: 5px; background-color: #333; color: white; border: 2px solid white; border-radius: 5px; cursor: pointer;`
        const themes = ['Basic', 'Synthwave', 'Sky']
        this.themeContainer = document.createElement('div') // Assign it to this.difficultyContainer
        this.themeContainer.style.display = 'flex'
        this.themeContainer.style.justifyContent = 'center'
        this.themeContainer.style.position = 'absolute'
        this.themeContainer.style.top = '35%'
        this.themeContainer.style.left = '50%'
        this.themeContainer.style.transform =
          'translate(-50%, -50%)'

        let selectedButton = null

        themes.forEach((theme) => {
          const themeButton =
            document.createElement('button')
          themeButton.innerText = theme
          themeButton.setAttribute('style', buttonStyles)

          if (theme === 'Basic') {
            selectedButton = themeButton
            selectedButton.style.color = 'black'
            selectedButton.style.backgroundColor = 'white'
          }

          themeButton.onclick = () => {
            if (selectedButton) {
              selectedButton.style.color = 'white'
              selectedButton.style.backgroundColor = '#333'
            }
            switch (theme) {
              case 'Basic':
                this.theme = 'Basic'
                break
              case 'Synthwave':
                this.theme = 'Synthwave'
                break
              case 'Sky':
                this.theme = 'Sky'
                break
            }
            themeButton.style.color = 'black'
            themeButton.style.backgroundColor = 'white'
            selectedButton = themeButton
            console.log(`Theme set to ${theme}`)
          }
          this.themeContainer.appendChild(themeButton)
        })

        document.body.appendChild(this.themeContainer)
        this.themeButtonsAdded = true
      }
    } else {
      // Gameplay
      // Background audio
      if (this.lobbyMusic) {
        this.lobbyMusic.pause()
        document.body.removeChild(this.lobbyMusic)
        this.lobbyMusic = null
      }

      let music_url = ''

      if (this.theme === 'Basic') {
        music_url = 'audio/ost.mp3'
      } else if (this.theme === 'Synthwave') {
        music_url = 'audio/perfectnight.mp3'
      } else if (this.theme === 'Sky') {
        music_url = 'audio/snowfall.mp3'
      }

      if (!this.music) {
        this.music = document.createElement('audio')
        this.music.id = 'background-music'
        this.music.autoplay = true
        this.music.loop = true
        this.music.src = music_url
        document.body.appendChild(this.music)
      }

      if (this.play_music) {
        this.music.play()
      } else {
        this.music.pause()
      }

      // Game has started
      if (this.score_container) {
        this.score_container.style.display = 'block' // Show score container during gameplay
      }
      // Clear start screen
      if (this.start_title) {
        this.start_title.style.display = 'none'
      }
      if (this.start_button) {
        this.start_button.style.display = 'none'
      }
      if (this.difficultyContainer) {
        this.difficultyContainer.style.display = 'none'
      }
      if (this.themeContainer) {
        this.themeContainer.style.display = 'none'
      }
      if (this.themeImage) {
        this.themeImage.style.display = 'none'
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

      this.spawnedCubes.forEach((cube) => {
        let playerPos = {
          x: 0,
          z: 10,
        } // Z is always 0 since we're assuming it's a fixed lane

        let cubePos = {
          x: cube.positionX - this.horizontal_position,
          z: cube.positionZ,
        }

        // Inside the spawnedCubes.forEach loop in the display method
        if (this.isColliding(playerPos, cubePos, this.cubeSize / 2)) {
          if (cube.isShield) {
            this.hasShield = true; // Store the shield power-up
            cube.isActive = false; // Remove the cube from the game
            this.updatePowerUpDisplay(); // Update the power-up display
          } else if (!this.shieldActive) { // Only end the game if the shield is not active
            this.started = false; // Stop the game
            this.showGameOverScreen(); // Show game over screen
            this.updatePowerUpDisplay(); // Update the power-up display
            return; // Exit the loop to avoid further processing
          }
        }
      })

      this.spawnedCubes.forEach((cube) => {
        if (cube.positionZ < 30 && cube.isActive) {
          // Check if cube is within visible range before drawing
          const cubeTransform = Mat4.translation(
            cube.positionX - this.horizontal_position,
            0,
            cube.positionZ
          )
          if (this.theme === 'Basic') {
            this.shapes.cube.draw(
              context,
              program_state,
              cubeTransform,
              this.materials.plastic.override({
                color: cube.isShield
                  ? hex_color('#00ff00')
                  : hex_color('#f1a593'),
              })
            )
          } else if (this.theme === 'Synthwave') {
            // Temporarily override the white material's color for synthwave theme
            const originalColor = this.white.color // Store the original color
            this.white.color = hex_color('#FF007F') // Set to bright pink
            if (cube.isShield) {
              this.shapes.green_outline.draw(
                context,
                program_state,
                cubeTransform,
                this.white,
                'LINES'
              )
            } else {
              this.shapes.outline.draw(
                context,
                program_state,
                cubeTransform,
                this.white,
                'LINES'
              )
            }
            // Restore the original color of the white material after drawing
            this.white.color = originalColor
          } else if (this.theme === 'Sky') {
            this.shapes.cube.draw(
              context,
              program_state,
              cubeTransform,
              this.materials.plastic.override({
                color: cube.isShield
                  ? hex_color('#00ff00')
                  : hex_color('#ffffff'),
              })
            )
          }
        }
      })

      // Adjust tilt angle based on user input
      const acceleration = 0.5
      const acceleration_factor = acceleration * dt ** 2

      if (this.left_key_pressed) {
        this.horizontal_position -=
          this.speed * dt - 0.5 * acceleration_factor
        this.tilt_angle -=
          this.tilt_speed * dt - acceleration_factor
      } else if (this.right_key_pressed) {
        this.horizontal_position +=
          this.speed * dt + 0.5 * acceleration_factor
        this.tilt_angle +=
          this.tilt_speed * dt + acceleration_factor
      } else {
        // Gradually return tilt angle to zero when no button is pressed
        if (this.tilt_angle > 0) {
          this.tilt_angle = Math.max(
            0,
            this.tilt_angle -
              this.tilt_speed * dt -
              0.5 * acceleration_factor
          )
        } else if (this.tilt_angle < 0) {
          this.tilt_angle = Math.min(
            0,
            this.tilt_angle +
              this.tilt_speed * dt +
              0.5 * acceleration_factor
          )
        }
      }

      // Cap the maximum tilt angle
      this.tilt_angle = Math.max(
        Math.min(this.tilt_angle, 0.045),
        -0.045
      )

      let camera_position = Mat4.inverse(
        Mat4.translation(0, 5, 30).times(
          Mat4.rotation(-this.tilt_angle, 0, 0, 1)
        )
      )

      program_state.set_camera(camera_position)
      program_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        context.width / context.height,
        1,
        100
      )

      // Transformation of floor and user
      let background_transform = Mat4.identity().times(
        Mat4.scale(300, 500, 1)
      )

      // Draw floor and user
      if (this.theme === 'Basic') {
        this.shapes.spaceship.draw(
          context,
          program_state,
          Mat4.identity()
            .times(
              Mat4.rotation(-this.tilt_angle * 5, 0, 0, 1)
            )
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
            .times(Mat4.translation(0, 0, -10, 0))
            .times(Mat4.scale(0.8, 0.8, 0.8)),
          this.materials.spaceship
        )
      } else if (this.theme === 'Synthwave') {
        this.shapes.background.draw(
          context,
          program_state,
          background_transform,
          this.materials.synthwave
        )

        this.shapes.floor.draw(
          context,
          program_state,
          Mat4.identity()
            .times(Mat4.translation(0, -66, -50, 0))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.scale(60, 60, 60)),
          this.materials.bluegrid
        )

        this.shapes.spaceship.draw(
          context,
          program_state,
          Mat4.identity()
            .times(
              Mat4.rotation(-this.tilt_angle * 5, 0, 0, 1)
            )
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
            .times(Mat4.translation(0, 0, -10, 0))
            .times(Mat4.scale(0.8, 0.8, 0.8)),
          this.materials.spaceship
        )
      } else if (this.theme === 'Sky') {
        this.shapes.background.draw(
          context,
          program_state,
          background_transform,
          this.materials.sky
        )

        this.shapes.spaceship.draw(
          context,
          program_state,
          Mat4.identity()
            .times(
              Mat4.rotation(-this.tilt_angle * 5, 0, 0, 1)
            )
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
            .times(Mat4.translation(0, 0, -10, 0))
            .times(Mat4.scale(0.8, 0.8, 0.8)),
          this.materials.spaceship.override({
            ambient: 0.2,
          })
        )
      }

      if (this.shieldActive && (performance.now() / 1000) < (this.shield_activate_time + this.shield_duration)) {
        this.shapes.shield.draw(
            context,
            program_state,
            Mat4.identity()
                .times(Mat4.rotation(-this.tilt_angle * 5, 0, 0, 1))
                .times(Mat4.translation(0, 0, 12, 0))
                .times(Mat4.scale(1.4, 1.4, 1.4)),
            this.materials.shield
        );
      } else {
        this.shieldActive = false; // Deactivate the shield once the duration expires
      }

      // Update and render score
      if (!this.is_paused) {
        this.update_score(
          program_state.animation_delta_time / 10
        )
      }
      this.render_score()
      this.achievements.forEach((achievement) => {
        if (
          !achievement.achieved &&
          this.current_score >= achievement.score
        ) {
          console.log(
            `Achievement unlocked: ${achievement.score} points!`
          )
          achievement.achieved = true
          // Store the achievement notification
          this.currentAchievement = {
            message: `${achievement.score} POINTS!`,
            timestamp: performance.now(), // Current time in milliseconds
          }
          // Show achievement notification
          this.showAchievementNotification()
        }
      })
    }
  }

  showMainMenu() {
    // Instead of directly starting the game again, we set up the main menu.
    this.started = false // Ensure the game is not marked as started.
    if (this.score_container) {
      this.score_container.style.display = 'none'
    }
    this.current_score = 0 // Optionally reset the current score, or you might want to keep the score until a new game starts.
    // Reset the high score.
    this.high_score = 0

    // Hide any game-specific UI elements that should not be visible in the main menu.
    if (this.game_over_container) {
      this.game_over_container.style.display = 'none'
    }

    // Show main menu elements
    if (this.start_title) {
      this.start_title.style.display = 'block'
    }
    if (this.start_button) {
      this.start_button.style.display = 'block'
    }
    if (this.difficultyContainer) {
      this.difficultyContainer.style.display = 'flex'
    }
    if (this.themeContainer) {
      this.themeContainer.style.display = 'flex'
    }
    if (this.started && this.score_container) {
      this.score_container.style.display = 'block'
    }
    if (this.themeImage) {
      this.themeImage.style.display = 'block'
    }

    if (this.music) {
      // this.music.src = 'audio/lastsurprise.mp3'
      this.music.pause()
      document.body.removeChild(this.music)
      this.music = null
    }

    // Reset or clear any game state variables if necessary
    this.is_paused = false
    this.spawnedCubes = [] // Clear spawned cubes if necessary.
    // Any other game state resets as needed.
  }

  showAchievementNotification() {
    // Ensure the achievement notification container exists
    if (!this.achievement_container) {
      this.achievement_container =
        document.createElement('div')
      this.achievement_container.style.position = 'absolute'
      this.achievement_container.style.color = 'gold'
      this.achievement_container.style.fontSize = '20px'
      this.achievement_container.style.zIndex = '1000' // Ensure it appears above the score container
      this.achievement_container.style.borderRadius = '5px'
      this.achievement_container.style.top = '40px'
      this.achievement_container.style.left = '10px'
    }

    // Set the achievement text and display it
    if (this.currentAchievement) {
      if (!this.achievement_title) {
        this.achievement_title =
          document.createElement('div')
        this.achievement_title.style.position = 'absolute'
        this.achievement_title.style.left = '10px'
        this.achievement_title.style.top = '10px'
        this.achievement_title.style.color = 'white'
        this.achievement_title.style.fontSize = '20px'
        this.achievement_title.style.zIndex = '1000' // Make sure it's on top

        // Append the score container to the WebGL canvas created by Canvas_Widget
        const canvasElement =
          document.querySelector('#main-canvas') // Select the main canvas element
        canvasElement.style.position = 'relative' // Ensure the canvas is positioned to anchor the score
        canvasElement.appendChild(this.achievement_title)

        this.achievement_title.textContent =
          'ACHIEVEMENT UNLOCKED:'
      }

      this.achievement_container.textContent =
        this.currentAchievement.message

      // Append to the same parent as the score container to maintain layout consistency
      const canvasElement =
        document.querySelector('#main-canvas')
      if (canvasElement) {
        canvasElement.appendChild(
          this.achievement_container
        ) // Append directly to the canvas for simplicity
      }

      // Hide the notification after 5 seconds
      setTimeout(() => {
        this.achievement_container.style.display = 'none'
        this.achievement_title.style.display = 'none'
        // Clear the current achievement to allow new ones to be displayed later
        this.currentAchievement = null
      }, 5000)
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
      this.score_container.style.right = '10px' // Keep score 5px from the right edge of the canvas
      this.score_container.style.top = '10px' // Keep score 5px from the top edge of the canvas
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
    this.high_score_element.textContent = `HIGH SCORE: ${Math.floor(
      this.high_score
    )}`
    this.current_score_element.textContent = `SCORE: ${Math.floor(
      this.current_score
    )}`
  }
}

class Texture_Scroll_X extends Textured_Phong {
  fragment_glsl_code() {
    return (
      this.shared_glsl_code() +
      `
          varying vec2 f_tex_coord;
          uniform sampler2D texture;
          uniform float animation_time;

          void main(){
              // Sample the texture image in the correct place:
              vec4 tex_color = texture2D( texture, f_tex_coord);
              if( tex_color.w < .01 ) discard;
              gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
              gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
      } `
    )
  }
}
