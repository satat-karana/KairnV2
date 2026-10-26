// Grabbing the chunk after the last '/', which should be the file name/url
const currentPath = window.location.pathname.split('/').pop();

//Essentially, a shorthand if else statement. if current path is set to nothing (on the main page), then it will show nothing, despite the file name likely being index.html, so then it will manually set currentPath to index.html, btw, ? stands for yes. and if current path did not equal nothing, then just set current page to currrentPath.
const currentPage = currentPath === ""?"index.html":currentPath;

const navLinks=document.querySelectorAll("nav a");

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
  
    if (linkPage == currentPage){
        link.classList.add("activePage");
    }
});

