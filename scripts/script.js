// Lesson Levels On page load
const getLevels = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/levels/all"
  );
  const data = await res.json();
  displayLevels(data.data);
};

const lessonContainer = document.getElementById("lessonContainer");
const displayLevels = (levels) => {
  for (const level of levels) {
    lessonContainer.innerHTML += `
            <button onclick="btnFunction(${level.level_no})" id="lessonBtn-${level.level_no}" class="btn btn-outline btn-primary lessonBtns"><i class="fa-solid fa-book-open"></i> Lesson-${level.level_no}</button>
        `;
  }
};

// Words On Button Click
const wordContainer = document.getElementById("wordContainer");
const getWords = async (id) => {
  controlLoader(true);
  const res = await fetch(
    `https://openapi.programming-hero.com/api/level/${id}`
  );
  const data = await res.json();
  controlLoader(false);
  displayWords(data.data);
};

const displayWords = (words) => {
  if (words.length === 0) {
    wordContainer.innerHTML = `
            <div class="py-[64px] content-center justify-items-center col-span-full">
          <img src="./assets/alert-error.png" alt="" />
          <p class="text-[#79716B] bangla mb-3 mt-3">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="text-[#292524] text-[34px] bangla font-medium">
            নেক্সট Lesson এ যান
          </h2>
        </div>
        `;
  } else {
    for (const word of words) {
      wordContainer.innerHTML += `
            <div class="py-[56px] bg-white rounded-[12px] text-center">
                    <h1 class="text-[32px] text-[#000000] font-bold">${
                      word.word ? word.word : "শব্দ খুঁজে পাওয়া যাইনি"
                    }</h1>
                    <h3 class="text-[20px] text-[#000000] font-medium mt-6 mb-6">Meaning /Pronounciation</h3>
                    <h1 class="bangla text-[32px] font-semibold text-[#18181B] opacity-80">"${
                      word.meaning ? word.meaning : "অর্থ খুঁজে পাওয়া যাইনি"
                    } / ${
        word.pronunciation ? word.pronunciation : "উচ্চারণ খুঁজে পাওয়া যাইনি"
      }"</h1>
                    <div class="flex justify-between mt-[56px] px-[47px]">
                        <button onclick="displayModal(${
                          word.id
                        })" class="btn border-none bg-[#1A91FF1A]"><i class="fa-solid fa-circle-exclamation"></i></button>
                        <button onclick="pronounceWord('${
                          word.word
                        }')" class="btn border-none bg-[#1A91FF1A]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
    
    
            `;
    }
  }
};

// Lesson Button functionality

const btnFunction = (id) => {
  removeActiveClass();
  addActiveClass(id);
  getWords(id);
};

const addActiveClass = (id) => {
  document.getElementById(`lessonBtn-${id}`).classList.add("active");
};

const lessonBtns = document.getElementsByClassName("lessonBtns");
const removeActiveClass = () => {
  for (const lessonBtn of lessonBtns) {
    lessonBtn.classList.remove("active");
  }
};

// Words container Control

// Control Loader
const controlLoader = (isVisible) => {
  if (isVisible) {
    wordContainer.innerHTML = `
            <div id="loader" class="py-[64px] col-span-full text-center">
            <span class="loading loading-dots loading-xl"></span>
            </div>
        `;
  } else {
    wordContainer.innerHTML = "";
  }
};

// Search Functionality
document.getElementById("searchBtn").addEventListener("click", () => {
  const searchWord = document.getElementById("searchWord").value;
  document.getElementById("searchWord").value = "";
  searchWord.trim().toLowerCase();
  removeActiveClass();
  filterWords(searchWord);
});

const filterWords = async (searchWord) => {
  controlLoader(true);
  const res = await fetch(`https://openapi.programming-hero.com/api/words/all`);
  const data = await res.json();
  const allWords = data.data;
  const filteredWords = allWords.filter((word) =>
    word.word.toLowerCase().includes(searchWord)
  );
  controlLoader(false);
  displayWords(filteredWords);
};

// Text to voice
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Show Modal

const displayModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      shownModal(data.data);
    });
};

const shownModal = (info) => {
  const parent = document.getElementById("modal-content");
  parent.innerHTML = `
  <h2 class="text-[36px] font-semibold text-[#000000] mb-8">
    ${info.word} (<i class="fa-solid fa-microphone-lines"></i> :${
    info.pronunciation
  })
  </h2>
  <p class="text-[24px] font-semibold text-[#000000]">Meaning</p>
  <p class="text-[24px] font-medium hind-font text-[#000000] mt-[10px] mb-[32px]">${
    info.meaning
  }</p>
  <p class="text-[24px] font-semibold text-[#000000]">Example</p>
  <p class="text-[24px] text-[#000000] mt-2 mb-8">${info.sentence}</p>
  <p class="text-[24px] font-semibold text-[#000000] hind-font">সমার্থক শব্দ গুলো</p>
  <div class="mt-[16px]">
    ${createBtn(info.synonyms)}
  </div>
  `;
  my_modal_5.showModal();
};

// Create synonym buttons dynamically
const createBtn = (synonyms) => {
  if (!synonyms || synonyms.length === 0) {
    return `<p class="text-gray-500">No synonyms available</p>`;
  }

  return synonyms
    .map(
      (syn) =>
        `<button onclick="pronounceWord('${syn}')" 
         class="btn border-none bg-[#1A91FF1A] m-1">${syn}</button>`
    )
    .join("");
};

getLevels();
