document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    const searchBar = document.getElementById("search-bar");
    const courseTableBody = document.getElementById("course-table-body");

    let courses = [];

    // Fetch data from JSON file
    fetch("subjects.json")
        .then(response => response.json())
        .then(data => {
            courses = data.courses;
            displayCourses(courses);
        })
        .catch(error => console.error("Error loading courses:", error));

    // Function to display courses in the table
    function displayCourses(filteredCourses, highlightText = "") {
        courseTableBody.innerHTML = ""; // Clear table before inserting new data
        filteredCourses.forEach(course => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${highlightMatch(course.year_level, highlightText)}</td>
                <td>${highlightMatch(course.sem, highlightText)}</td>
                <td>${highlightMatch(course.code, highlightText)}</td>
                <td>${highlightMatch(course.description, highlightText)}</td>
                <td>${highlightMatch(course.credit, highlightText)}</td>
            `;
            courseTableBody.appendChild(row);
        });
    }

    // Function to highlight matching text
    function highlightMatch(text, searchText) {
        if (!searchText) return text; // Return original text if no search
        const regex = new RegExp(`(${searchText})`, "gi");
        return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap match in span
    }

    // Filter courses based on search input
    searchBar.addEventListener("input", function () {
        const searchText = searchBar.value.toLowerCase();
        const filteredCourses = courses.filter(course =>
            course.year_level.toLowerCase().includes(searchText) ||
            course.sem.toLowerCase().includes(searchText) ||
            course.code.toLowerCase().includes(searchText) ||
            course.description.toLowerCase().includes(searchText) ||
            course.credit.toLowerCase().includes(searchText)
        );
        displayCourses(filteredCourses, searchText);
    });
});