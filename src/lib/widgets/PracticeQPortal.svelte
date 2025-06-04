<script lang="ts">
  import { onMount } from 'svelte';
  import { practiceQuestions, appMode } from '../store';
  import type { PracticeQuestion } from '../store';
  import { get } from 'svelte/store';

  let mode: 'list' | 'add' | 'session' | 'result' = 'list';
  let questions: PracticeQuestion[] = [];
  let newQuestion = '';
  let newOptions = '';
  let newAnswer = '';
  let newExplanation = '';
  let category: 'digital' | 'analog' = 'digital';

  let sessionIndex = 0;
  let userAnswer = '';
  let score = 0;
  let showExplanation = false;
  let startTime = 0;
  let elapsed = 0;

  onMount(() => {
    const stored = localStorage.getItem('practiceQuestions');
    if (stored) {
      questions = JSON.parse(stored);
      practiceQuestions.set(questions);
    }
    practiceQuestions.subscribe(v => {
      questions = v;
    });
  });

  function saveQuestions() {
    localStorage.setItem('practiceQuestions', JSON.stringify(questions));
  }

  function addQuestion() {
    const q: PracticeQuestion = {
      id: Date.now(),
      text: newQuestion,
      options: newOptions ? newOptions.split('\n') : [],
      answer: newAnswer,
      explanation: newExplanation,
      category
    };
    questions = [...questions, q];
    practiceQuestions.set(questions);
    saveQuestions();
    newQuestion = newOptions = newAnswer = newExplanation = '';
    mode = 'list';
  }

  function startSession() {
    sessionIndex = 0;
    score = 0;
    showExplanation = false;
    userAnswer = '';
    startTime = Date.now();
    mode = 'session';
  }

  function submitAnswer() {
    const q = questions[sessionIndex];
    if (userAnswer.trim() === q.answer.trim()) score += 1;
    showExplanation = true;
  }

  function nextQuestion() {
    showExplanation = false;
    userAnswer = '';
    sessionIndex += 1;
    if (sessionIndex >= questions.length) {
      elapsed = Math.floor((Date.now() - startTime) / 1000);
      mode = 'result';
    }
  }

  function close() {
    appMode.set('home');
  }
</script>

<div class="practiceq-container">
  <button class="close-btn" on:click={close}>Close</button>

  {#if mode === 'list'}
    <h2>Practice Questions</h2>
    <button on:click={() => (mode = 'add')}>Add Question</button>
    <button on:click={startSession} disabled={questions.length === 0}>Start Session</button>
    <ul>
      {#each questions as q}
        <li>{q.text} ({q.category})</li>
      {/each}
    </ul>
  {:else if mode === 'add'}
    <h2>Add Question</h2>
    <input placeholder="Question" bind:value={newQuestion} />
    <textarea placeholder="Options (one per line, optional)" bind:value={newOptions}></textarea>
    <input placeholder="Answer" bind:value={newAnswer} />
    <textarea placeholder="Explanation" bind:value={newExplanation}></textarea>
    <select bind:value={category}>
      <option value="digital">digital</option>
      <option value="analog">analog</option>
    </select>
    <button on:click={addQuestion}>Save</button>
    <button on:click={() => (mode = 'list')}>Cancel</button>
  {:else if mode === 'session'}
    <h2>Question {sessionIndex + 1} / {questions.length}</h2>
    <p>{questions[sessionIndex].text}</p>
    {#if questions[sessionIndex].options.length}
      <ul>
        {#each questions[sessionIndex].options as opt}
          <li>{opt}</li>
        {/each}
      </ul>
    {/if}
    {#if !showExplanation}
      <input placeholder="Your answer" bind:value={userAnswer} />
      <button on:click={submitAnswer}>Submit</button>
    {:else}
      <p>Answer: {questions[sessionIndex].answer}</p>
      <p>{questions[sessionIndex].explanation}</p>
      <button on:click={nextQuestion}>{sessionIndex < questions.length - 1 ? 'Next' : 'Finish'}</button>
    {/if}
  {:else if mode === 'result'}
    <h2>Session Complete</h2>
    <p>Score: {score} / {questions.length}</p>
    <p>Time: {elapsed}s</p>
    <button on:click={() => (mode = 'list')}>Back</button>
  {/if}
</div>

<style>
.practiceq-container {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  width: 90vw;
  max-width: 600px;
  background: rgba(0, 255, 238, 0.06);
  border: 1px solid #00ffee99;
  color: #00ffee;
  padding: 1rem;
  font-family: 'Orbitron', monospace;
  z-index: 1000;
}
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
