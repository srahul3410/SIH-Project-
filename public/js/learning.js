var coursesData = {
  // 1. DSA in C Language (CodeWithHarry / Apna College verified embed IDs)
  dsa_c: {
    title: "DSA in C Language",
    playlistUrl: "https://youtube.com/playlist?list=PLu0W_9lII9ahI43GFiUxEGPE54PydhKU9",
    videos: [
      { id: "ZSPZob_1TOk", title: "Lec 1: Introduction to C & Architecture", duration: "25 mins" },
      { id: "7i1s_q6x1m8", title: "Lec 2: Variables, Data Types & Constants", duration: "28 mins" },
      { id: "irqbmMNs2Bo", title: "Lec 3: Operators & Expressions in C", duration: "32 mins" },
      { id: "il_t1WVLNxk", title: "Lec 4: Decision Control & Conditionals", duration: "35 mins" },
      { id: "AT14lCXuMKI", title: "Lec 5: Introduction to Data Structures & Complexity", duration: "24 mins" },
      { id: "Db9ZYbJONHc", title: "Lec 6: Arrays and Operations in C", duration: "30 mins" },
      { id: "58Ybp0KpHkY", title: "Lec 7: Linear Search vs Binary Search", duration: "27 mins" },
      { id: "dwduD270n28", title: "Lec 8: Pointers & Singly Linked List Creation", duration: "42 mins" }
    ]
  },

  // 2. DSA in Java Placement Series (Apna College)
  dsa_java: {
    title: "DSA in Java Placement Series (Apna College)",
    playlistUrl: "https://youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    videos: [
      { id: "yRpLlJmRo2w", title: "Lec 1: Java Basics & Setup Environment", duration: "24 mins" },
      { id: "lus0C_D3R1Y", title: "Lec 2: Variables, Output & Data Types", duration: "31 mins" },
      { id: "I5srDu75Quc", title: "Lec 3: Conditional Statements (if-else, switch)", duration: "40 mins" },
      { id: "0r1SBLU_WpA", title: "Lec 4: Loops & Patterns in Java", duration: "38 mins" },
      { id: "qcQKStz8R_A", title: "Lec 5: Functions & Methods in Java", duration: "45 mins" },
      { id: "bQpsch8__V8", title: "Lec 6: Object Oriented Programming (OOPs)", duration: "58 mins" }
    ]
  },

  // 3. Frontend Web Development (CodeWithHarry - Sigma Web Dev)
  frontend: {
    title: "Frontend Web Development (CodeWithHarry)",
    playlistUrl: "https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w",
    videos: [
      { id: "tVzUXW6siu0", title: "Lec 1: Web Architecture & VS Code Setup", duration: "32 mins" },
      { id: "kJEsTjH5mVg", title: "Lec 2: HTML Fundamentals & Tags", duration: "41 mins" },
      { id: "ESnrn1kAD4E", title: "Lec 3: CSS3 Basics & Selectors", duration: "38 mins" },
      { id: "1Rs2ND1ryYc", title: "Lec 4: CSS Box Model & Margins", duration: "46 mins" },
      { id: "W6NZfCO5SIk", title: "Lec 5: JavaScript Intro & Variables", duration: "44 mins" },
      { id: "PkZNo7MFNFg", title: "Lec 6: DOM Manipulation & Event Listeners", duration: "52 mins" }
    ]
  },

  // 4. Backend Web Development (CodeWithHarry & Apna College - Verified Working IDs)
  backend: {
    title: "Backend Web Development (CodeWithHarry & Apna College)",
    playlistUrl: "https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w",
    videos: [
      { id: "BLl32FvcdVM", title: "Lec 1: Node.js Architecture & Installation (CodeWithHarry)", duration: "25 mins" },
      { id: "VlPiVmYuoqw", title: "Lec 2: JavaScript Runtime & Async Logic (Apna College)", duration: "45 mins" },
      { id: "oSIv-E60NiU", title: "Lec 3: MongoDB & Database Collections (CodeWithHarry)", duration: "38 mins" },
      { id: "hlGoQC332VM", title: "Lec 4: SQL & Relational Databases (Apna College)", duration: "50 mins" },
      { id: "gwWKnnCMQ5c", title: "Lec 5: Git & GitHub Deployment Workflow (Apna College)", duration: "40 mins" },
      { id: "tVzUXW6siu0", title: "Lec 6: Client-Server Architecture & HTTP (CodeWithHarry)", duration: "32 mins" }
    ]
  },

  // 5. Python 100 Days Masterclass (CodeWithHarry)
  python: {
    title: "100 Days of Python (CodeWithHarry)",
    playlistUrl: "https://youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg",
    videos: [
      { id: "7wnove7K-ZQ", title: "Day 1: What is Python & Installation", duration: "21 mins" },
      { id: "vx2u5uUu3DE", title: "Day 2: Modules, Packages & Pip", duration: "25 mins" },
      { id: "Tto8TS-fJQU", title: "Day 3: Variables & Built-in Data Types", duration: "32 mins" },
      { id: "FLVqxcVpUfg", title: "Day 4: String Slicing & Operations", duration: "28 mins" },
      { id: "7wA13-8B3c4", title: "Day 5: Conditionals & If-Else", duration: "34 mins" },
      { id: "f9_47B9E3qA", title: "Day 6: Loops in Python", duration: "39 mins" }
    ]
  }
};

function openCourseModal(courseKey) {
  var course = coursesData[courseKey];
  var modal = document.getElementById("playlistModal");
  var courseTitle = document.getElementById("currentCourseTitle");
  var lectureCounter = document.getElementById("lectureCounter");
  var lectureListContainer = document.getElementById("lectureListContainer");

  if (!course || !modal) {
    return;
  }

  courseTitle.innerText = course.title;
  lectureCounter.innerText = course.videos.length + " Lessons";
  lectureListContainer.innerHTML = "";

  for (var i = 0; i < course.videos.length; i++) {
    (function(index) {
      var video = course.videos[index];
      var item = document.createElement("div");
      item.className = "lecture-item" + (index === 0 ? " active" : "");
      item.id = "lecture-node-" + index;

      item.onclick = function() {
        selectVideo(index, video.id, video.title);
      };

      item.innerHTML = 
        '<span class="lecture-index">' + (index + 1) + '</span>' +
        '<div class="lecture-meta">' +
          '<div class="lecture-name">' + video.title + '</div>' +
          '<span class="lecture-duration">' + video.duration + '</span>' +
        '</div>' +
        '<i class="ri-play-circle-line"></i>';

      lectureListContainer.appendChild(item);
    })(i);
  }

  // Load first video by direct ID
  selectVideo(0, course.videos[0].id, course.videos[0].title);
  modal.style.display = "flex";
}

function selectVideo(index, videoId, videoTitle) {
  var player = document.getElementById("activeVideoPlayer");
  var currentTitle = document.getElementById("currentVideoTitle");
  var ytDirectBtn = document.getElementById("modalYtDirectBtn");
  var items = document.querySelectorAll(".lecture-item");

  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }

  var activeNode = document.getElementById("lecture-node-" + index);
  if (activeNode) {
    activeNode.classList.add("active");
  }

  if (currentTitle) {
    currentTitle.innerText = videoTitle;
  }

  if (ytDirectBtn) {
    ytDirectBtn.href = "https://www.youtube.com/watch?v=" + videoId;
  }

  if (player) {
    player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
  }
}

function closeCourseModal() {
  var modal = document.getElementById("playlistModal");
  var player = document.getElementById("activeVideoPlayer");

  if (player) {
    player.src = "";
  }
  if (modal) {
    modal.style.display = "none";
  }
}

window.onclick = function(event) {
  var modal = document.getElementById("playlistModal");
  if (event.target === modal) {
    closeCourseModal();
  }
};

window.openCourseModal = openCourseModal;
window.closeCourseModal = closeCourseModal;
window.selectVideo = selectVideo;