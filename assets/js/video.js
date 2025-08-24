// global dataArray
let dataArray = [];

// search field
document.getElementById("searchField").addEventListener("keyup", (e) => {
  const text = e.target.value;
  loadVideos(text);
});

// posted date conversion to hrs, mins and seconds
const setTime = (totalTimeString) => {
  const totalTime = parseInt(totalTimeString);
  const hrs = parseInt(totalTime / 3600);
  let remainingSecond = totalTime % 3600;
  const mins = parseInt(remainingSecond / 60);
  const sec = remainingSecond % 60;

  return `${hrs} hrs ${mins} mins ${sec} sec`;
};

const setBtn = () => {
  // get all category buttons by class name
  const categoryBtns = document.getElementsByClassName("categoryBtns");
  for (const categoryBtn of categoryBtns) {
    categoryBtn.classList.remove("active");
    // console.log(categoryBtn);
  }

  // get clicked category button by id
  const btn = document.getElementById(`allId`);
  btn.classList.add("active");
};

// load Category function
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.log(err));
};

const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => {
      dataArray = data.videos;
      // console.log(data.videos);
      // console.log(dataArray);
      displayVideos(dataArray);
    })
    .catch((err) => console.log(err));
};

const loadCategorizeVideo = async (ID) => {
  // get all category buttons by class name
  const categoryBtns = document.getElementsByClassName("categoryBtns");
  for (const categoryBtn of categoryBtns) {
    categoryBtn.classList.remove("active");
    // console.log(categoryBtn);
  }

  // get clicked category button by id
  const btn = document.getElementById(`categoryBtn${ID}`);
  btn.classList.add("active");

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${ID}`
    );
    const data = await res.json();
    dataArray = data.category;
    // console.log(data.category);
    // console.log(dataArray);
    displayVideos(dataArray);
  } catch (err) {
    console.log(err);
  }
};

// load details
const loadVideoDetails = async (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  displayModal(data.video);
};

const displayModal = (video) => {
  // console.log(authors);
  const detailsContainer = document.getElementById("modalContent");

  detailsContainer.innerHTML = `
      <img class="rounded-lg w-full h-[250px]" src="${video.thumbnail}"/>
      <p class = "py-3 text-justify">${video.description}</p>
    `;

  // getting modal dialog
  document.getElementById("detailsModal").showModal();
};

const displayCategories = (categories) => {
  // get container for categories button
  const categoriesButtonContainer = document.getElementById("navBottom");
  categories.forEach((item) => {
    const categoryID = item.category_id;
    const button = document.createElement("button");
    button.classList = "btn categoryBtns";
    button.setAttribute("id", `categoryBtn${categoryID}`);
    button.setAttribute("onclick", `loadCategorizeVideo(${categoryID})`);
    button.innerText = item.category;

    // console.log(button);

    // append to container
    categoriesButtonContainer.appendChild(button);
  });
};
// let clicked = false;
// const isClicked = () => {
//   clicked = true;
//   console.log(clicked);
// }
// console.log(clicked);

const displayVideos = (videos) => {
  // get videosContainer
  const videosContainer = document.getElementById("videosContainer");
  // clean previous data of videosContainer
  videosContainer.innerHTML = "";

  // console.log(videos[0]);
  // if no videos are available
  if (videos.length == 0) {
    // videosContainer.classList.add('self-center')
    const div = document.createElement("div");
    div.classList =
      "col-span-4 h-96 flex flex-col justify-center items-center gap-5";
    div.innerHTML = `
        <img src= "./assets/images/Icon.png"/>
        <h3 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h3>
      `;
    videosContainer.append(div);
    return;
  }
  // console.log("no");
  videos.forEach((video) => {
    // create card div
    const cardDiv = document.createElement("div");
    cardDiv.classList = "flex flex-col gap-5 ";

    // getting modal dialog
    const detailsModal = document.getElementById("detailsModal");

    cardDiv.innerHTML = `
          <div class="cardImg h-[250px] relative">
            <img class="w-full h-full border-0 rounded-lg" src="${
              video.thumbnail
            }" alt="Videos Thumbnail" />
            ${
              video.others.posted_date != ""
                ? `<p class="absolute bottom-4 right-4 bg-black p-1 px-2 rounded-lg text-white">${setTime(
                    video.others.posted_date
                  )}</p>`
                : ""
            }
          </div>
          <div class="cardContents flex flex-col  justify-center gap-2">
            <div class="titleImg flex items-center gap-3">
              <div class="w-[40px] h-[40px]">
                  <img class="rounded-full w-full h-full object-fill" src="${
                    video.authors[0].profile_picture
                  }" alt="" />
              </div>
              
              <h3>${video.title}</h3>
            </div>
            <div class="nameVerify flex items-center gap-3">
              <p class="name">${video.authors[0].profile_name}</p>
              ${
                video.authors[0].verified
                  ? `<i class="fa-solid fa-circle-check text-primary"></i>`
                  : ""
              }
            </div>
            <p class="views">${video.others.views}</p>
            <button id="detailsBtn" class="btn bg-sky-200 font-semibold" onclick="loadVideoDetails('${
              video.video_id
            }')">Show Details</button>
          </div>`;

    // console.log(video.video_id);

    // append cardDiv in videosContainer
    videosContainer.append(cardDiv);
  });
};

// const displayCategorizeVideo = (category) => {

// }

loadCategories();
loadVideos();

// sort onclick the sort button
document.getElementById("sortBtn").addEventListener("click", () => {
  dataArray.sort((a, b) => {
    const viewsA = parseFloat(a.others.views.replace("K", ""));
    const viewsB = parseFloat(b.others.views.replace("K", ""));
    return viewsA - viewsB; // ascending
    // return viewsB - viewsA; // descending
  });
  displayVideos(dataArray);
});
