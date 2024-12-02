
// Function to add the listener when the search bar is found
function attachSearchBarListener() {
  const searchBar = document.querySelector("#APjFqb");
  console.log("window.location.hostname:",window.location.hostname);

  if (searchBar) {
    searchBar.addEventListener("keydown", (event) => {
    //   console.log("keydown event");
      if (event.key === "Enter")
        {
            const userInput = event.target.value;
            console.log("User pressed Enter with input:", userInput);
        }
    });
    return true;
  }
  return false;
}

// Use MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(() => {
  if (attachSearchBarListener()) {
    observer.disconnect(); // Stop observing once the search bar is found and listener is attached
  }
});

// Start observing the body for child node changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log("MutationObserver is watching for search bar.");
