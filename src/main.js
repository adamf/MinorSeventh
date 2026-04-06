/**
 * Minor Seventh - Modern Ear Training App
 * Main Application Module
 */

import { audioManager } from './audio.js';
import { NOTES, INTERVALS, MIDDLE_C_INDEX } from './intervals.js';

// Application State
const state = {
  mode: 'quiz', // 'quiz' or 'trainer'
  currentInterval: 0,
  lastInterval: -1,
  correctAnswers: 0,
  totalAnswers: 0,
  playArpeggios: true,
  ascending: true,
  isPlaying: false,
  hasPlayed: false,
  audioReady: false
};

// Configuration
const DELAY_BETWEEN_NOTES = 1500; // ms

// DOM Elements
const elements = {
  app: null,
  playBtn: null,
  results: null,
  correctCount: null,
  totalCount: null,
  intervalInfo: null,
  intervalInfoTrainer: null,
  answers: null,
  trainerButtons: null,
  showAnswerBtn: null,
  quizSection: null,
  trainerSection: null,
  quizModeBtn: null,
  trainerModeBtn: null,
  arpeggioOn: null,
  arpeggioOff: null,
  directionUp: null,
  directionDown: null
};

/**
 * Initialize the application
 */
async function init() {
  // Cache DOM elements
  cacheElements();
  
  // Set up event listeners
  setupEventListeners();
  
  // Generate buttons
  generateAnswerButtons();
  generateTrainerButtons();
  
  // Initialize audio on first user interaction
  document.addEventListener('click', initAudioOnce, { once: true });
  document.addEventListener('touchstart', initAudioOnce, { once: true });
  
  // Set initial interval
  setNewInterval();
  
  console.log('Minor Seventh initialized');
}

/**
 * Cache all DOM element references
 */
function cacheElements() {
  elements.app = document.getElementById('app');
  elements.playBtn = document.getElementById('play-btn');
  elements.results = document.getElementById('results');
  elements.correctCount = document.getElementById('correct-count');
  elements.totalCount = document.getElementById('total-count');
  elements.intervalInfo = document.getElementById('interval-info');
  elements.intervalInfoTrainer = document.getElementById('interval-info-trainer');
  elements.answers = document.getElementById('answers');
  elements.trainerButtons = document.getElementById('trainer-buttons');
  elements.showAnswerBtn = document.getElementById('show-answer-btn');
  elements.quizSection = document.getElementById('quiz-section');
  elements.trainerSection = document.getElementById('trainer-section');
  elements.quizModeBtn = document.getElementById('quiz-mode-btn');
  elements.trainerModeBtn = document.getElementById('trainer-mode-btn');
  elements.arpeggioOn = document.getElementById('arpeggio-on');
  elements.arpeggioOff = document.getElementById('arpeggio-off');
  elements.directionUp = document.getElementById('direction-up');
  elements.directionDown = document.getElementById('direction-down');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Play button
  elements.playBtn.addEventListener('click', handlePlay);
  
  // Show answer button
  elements.showAnswerBtn.addEventListener('click', showAnswer);
  
  // Mode toggle
  elements.quizModeBtn.addEventListener('click', () => setMode('quiz'));
  elements.trainerModeBtn.addEventListener('click', () => setMode('trainer'));
  
  // Options toggles
  elements.arpeggioOn.addEventListener('click', () => setArpeggio(true));
  elements.arpeggioOff.addEventListener('click', () => setArpeggio(false));
  elements.directionUp.addEventListener('click', () => setDirection(true));
  elements.directionDown.addEventListener('click', () => setDirection(false));
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);
}

/**
 * Initialize audio on first user interaction
 */
async function initAudioOnce() {
  if (state.audioReady) return;
  
  try {
    elements.app.classList.add('loading');
    elements.results.textContent = 'Loading sounds...';
    
    await audioManager.loadSamples(NOTES);
    
    state.audioReady = true;
    elements.app.classList.remove('loading');
    elements.results.textContent = "Click 'Play' to begin training.";
    
    console.log('Audio system ready');
  } catch (error) {
    console.error('Failed to initialize audio:', error);
    elements.results.textContent = 'Error loading sounds. Please refresh the page.';
    elements.app.classList.remove('loading');
  }
}

/**
 * Generate answer buttons for quiz mode
 */
function generateAnswerButtons() {
  elements.answers.innerHTML = INTERVALS.map((interval, index) => `
    <button 
      class="answer-btn" 
      data-interval="${index}"
    >
      ${interval.name}
    </button>
  `).join('');
  
  // Add event listeners to answer buttons
  elements.answers.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => handleGuess(parseInt(btn.dataset.interval)));
  });
}

/**
 * Generate trainer buttons
 */
function generateTrainerButtons() {
  elements.trainerButtons.innerHTML = INTERVALS.map((interval, index) => `
    <button 
      class="trainer-btn" 
      data-interval="${index}"
    >
      ${interval.name}
    </button>
  `).join('');
  
  // Add event listeners to trainer buttons
  elements.trainerButtons.querySelectorAll('.trainer-btn').forEach(btn => {
    btn.addEventListener('click', () => handleTrainerPlay(parseInt(btn.dataset.interval)));
  });
}

/**
 * Set a new random interval (different from the last one)
 */
function setNewInterval() {
  let newInterval;
  do {
    newInterval = Math.floor(Math.random() * INTERVALS.length);
  } while (newInterval === state.lastInterval && INTERVALS.length > 1);
  
  state.lastInterval = state.currentInterval;
  state.currentInterval = newInterval;
  state.hasPlayed = false;
  
  updatePlayButton('▶ Play');
}

/**
 * Handle play button click
 */
async function handlePlay() {
  if (state.isPlaying) return;
  
  // Ensure audio is ready
  if (!state.audioReady) {
    await initAudioOnce();
    if (!state.audioReady) return;
  }
  
  await playInterval(state.currentInterval, false);
  state.hasPlayed = true;
  updatePlayButton('🔄 Play Again');
  updateResults('');
}

/**
 * Play an interval
 */
async function playInterval(intervalIndex, showInfo = false) {
  if (state.isPlaying) return;
  
  state.isPlaying = true;
  setButtonsDisabled(true);
  
  await audioManager.ensureReady();
  
  const interval = INTERVALS[intervalIndex];
  const middleC = MIDDLE_C_INDEX;
  let secondNoteIndex;
  
  if (state.ascending) {
    secondNoteIndex = middleC + interval.semitones;
  } else {
    secondNoteIndex = middleC - interval.semitones;
  }
  
  // Ensure index is within bounds
  secondNoteIndex = Math.max(0, Math.min(secondNoteIndex, NOTES.length - 1));
  
  const firstNote = NOTES[middleC];
  const secondNote = NOTES[secondNoteIndex];
  
  // Play combined interval sound
  const combinedId = `${firstNote}-${secondNote}`;
  audioManager.play(combinedId);
  
  // Play arpeggiated notes if enabled
  if (state.playArpeggios) {
    setTimeout(() => {
      audioManager.play(firstNote);
    }, DELAY_BETWEEN_NOTES);
    
    setTimeout(() => {
      audioManager.play(secondNote);
      state.isPlaying = false;
      setButtonsDisabled(false);
    }, DELAY_BETWEEN_NOTES * 2);
  } else {
    state.isPlaying = false;
    setButtonsDisabled(false);
  }
  
  // Show interval info if requested (trainer mode)
  if (showInfo) {
    elements.intervalInfoTrainer.textContent = interval.description;
  }
}

/**
 * Handle a guess in quiz mode
 */
function handleGuess(guessedInterval) {
  if (!state.hasPlayed) {
    updateResults("Press 'Play' first to hear the interval!");
    return;
  }
  
  state.totalAnswers++;
  
  const answerBtn = elements.answers.querySelector(`[data-interval="${guessedInterval}"]`);
  
  if (guessedInterval === state.currentInterval) {
    // Correct answer
    state.correctAnswers++;
    answerBtn.classList.add('correct');
    
    updateResults(`Correct! That was a ${INTERVALS[guessedInterval].name}.`);
    elements.intervalInfo.textContent = INTERVALS[guessedInterval].description;
    
    // Reset and set new interval after brief delay
    setTimeout(() => {
      answerBtn.classList.remove('correct');
      elements.intervalInfo.textContent = '';
      setNewInterval();
    }, 1500);
  } else {
    // Incorrect answer
    answerBtn.classList.add('incorrect');
    updateResults('Incorrect, try again.');
    
    setTimeout(() => {
      answerBtn.classList.remove('incorrect');
    }, 500);
  }
  
  updateScore();
}

/**
 * Show the correct answer
 */
function showAnswer() {
  if (!state.hasPlayed) {
    updateResults("Press 'Play' first to hear the interval!");
    return;
  }
  
  const interval = INTERVALS[state.currentInterval];
  updateResults(`The correct interval was ${interval.name}.`);
  elements.intervalInfo.textContent = interval.description;
  
  // Highlight correct answer
  const correctBtn = elements.answers.querySelector(`[data-interval="${state.currentInterval}"]`);
  correctBtn.classList.add('correct');
  
  setTimeout(() => {
    correctBtn.classList.remove('correct');
    elements.intervalInfo.textContent = '';
    setNewInterval();
  }, 2000);
}

/**
 * Handle trainer button click
 */
async function handleTrainerPlay(intervalIndex) {
  if (state.isPlaying) return;
  
  // Ensure audio is ready
  if (!state.audioReady) {
    await initAudioOnce();
    if (!state.audioReady) return;
  }
  
  const btn = elements.trainerButtons.querySelector(`[data-interval="${intervalIndex}"]`);
  btn.classList.add('playing');
  
  await playInterval(intervalIndex, true);
  
  setTimeout(() => {
    btn.classList.remove('playing');
  }, state.playArpeggios ? DELAY_BETWEEN_NOTES * 2 : 500);
}

/**
 * Set the current mode
 */
function setMode(mode) {
  if (mode === state.mode) return;
  
  state.mode = mode;
  
  if (mode === 'quiz') {
    elements.quizSection.classList.remove('hidden');
    elements.trainerSection.classList.add('hidden');
    elements.quizModeBtn.classList.add('active');
    elements.trainerModeBtn.classList.remove('active');
    updateResults("Click 'Play' to begin training.");
    elements.intervalInfo.textContent = '';
  } else {
    elements.quizSection.classList.add('hidden');
    elements.trainerSection.classList.remove('hidden');
    elements.quizModeBtn.classList.remove('active');
    elements.trainerModeBtn.classList.add('active');
    elements.intervalInfoTrainer.textContent = '';
  }
}

/**
 * Set arpeggio option
 */
function setArpeggio(enabled) {
  state.playArpeggios = enabled;
  
  if (enabled) {
    elements.arpeggioOn.classList.add('active');
    elements.arpeggioOff.classList.remove('active');
  } else {
    elements.arpeggioOn.classList.remove('active');
    elements.arpeggioOff.classList.add('active');
  }
}

/**
 * Set direction option
 */
function setDirection(ascending) {
  state.ascending = ascending;
  
  if (ascending) {
    elements.directionUp.classList.add('active');
    elements.directionDown.classList.remove('active');
  } else {
    elements.directionUp.classList.remove('active');
    elements.directionDown.classList.add('active');
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeydown(event) {
  // Space or Enter to play
  if (event.code === 'Space' || event.code === 'Enter') {
    if (state.mode === 'quiz') {
      event.preventDefault();
      handlePlay();
    }
  }
  
  // Number keys 1-9, 0 for intervals
  const key = event.key;
  if (key >= '1' && key <= '9') {
    const index = parseInt(key) - 1;
    if (index < INTERVALS.length) {
      event.preventDefault();
      if (state.mode === 'quiz') {
        handleGuess(index);
      } else {
        handleTrainerPlay(index);
      }
    }
  }
  if (key === '0' && INTERVALS.length >= 10) {
    event.preventDefault();
    if (state.mode === 'quiz') {
      handleGuess(9);
    } else {
      handleTrainerPlay(9);
    }
  }
}

/**
 * Update the play button text
 */
function updatePlayButton(text) {
  elements.playBtn.querySelector('span').textContent = text;
}

/**
 * Update the results message
 */
function updateResults(message) {
  elements.results.textContent = message || "Click 'Play' to begin training.";
}

/**
 * Update the score display
 */
function updateScore() {
  elements.correctCount.textContent = state.correctAnswers;
  elements.totalCount.textContent = state.totalAnswers;
}

/**
 * Enable/disable all interactive buttons
 */
function setButtonsDisabled(disabled) {
  elements.playBtn.disabled = disabled;
  elements.answers.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = disabled;
  });
  elements.trainerButtons.querySelectorAll('.trainer-btn').forEach(btn => {
    btn.disabled = disabled;
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
