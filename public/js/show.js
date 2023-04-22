// get all the edit buttons
const editButtons = document.querySelectorAll("#btnEdit");

// add event listeners to each edit button
editButtons.forEach((button) => {
  button.addEventListener("click", () => {
    
    // get the parent div of the edit button
    const parentDiv = button.parentNode.parentNode;

    // get the "beforeEdit" and "afterEdit" divs inside the parent div
    const beforeEditDiv = parentDiv.querySelector(".beforeEdit");
    const afterEditDiv = parentDiv.querySelector(".afterEdit");

    // toggle the visibility of the "beforeEdit" and "afterEdit" divs
    beforeEditDiv.style.display = "none";
    afterEditDiv.style.display = "block";
  });
});

const cancelButtons = document.querySelectorAll('#cancelBtn')

cancelButtons.forEach((button)=>{
    
    button.addEventListener("click", (e)=>{
        e.preventDefault()
        // get the parent div of the edit button
        const parentDiv = button.parentNode.parentNode.parentNode;

        // get the "beforeEdit" and "afterEdit" divs inside the parent div
        const beforeEditDiv = parentDiv.querySelector(".beforeEdit");
        const afterEditDiv = parentDiv.querySelector(".afterEdit");

        // toggle the visibility of the "beforeEdit" and "afterEdit" divs
        beforeEditDiv.style.display = "block";
        afterEditDiv.style.display = "none";
    })
})