const apiUrl = "http://localhost:3000/api/ideas"; 
let currentPage = 1;
let pageSize = 2; 
let sort = "published_at";
const header = document.getElementById("header"); 
let lastScrollTop = 0; 

document.addEventListener("DOMContentLoaded", () => {
    fetchData(); 
});

async function fetchData() {
    pageSize = document.getElementById("pageSize").value; 
    sort = document.getElementById("sort").value; 

    const url = `${apiUrl}?page[number]=${currentPage}&page[size]=${pageSize}&append[]=small_image&append[]=medium_image&sort=${sort}`;
    console.log("Fetching data from:", url); 

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); 

        if (data.data && data.meta) {
            displayPosts(data.data);
            setupPagination(data.meta); 
            
            
            const totalItems = data.meta.total; 
            const startItem = (currentPage - 1) * pageSize + 1;
            const endItem = Math.min(startItem + pageSize - 1, totalItems);

            document.getElementById("item-count").innerText = `Showing ${startItem}-${endItem} out of ${totalItems}`;
        } else {
            console.error("Unexpected data structure:", data);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function displayPosts(posts) {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; 

   
    const postsToDisplay = posts.slice(0, pageSize);

    postsToDisplay.forEach(post => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");

        const title = post.title || "Untitled";
        const releaseDate = post.published_at ? new Date(post.published_at).toLocaleDateString() : "Unknown Release Date";
        const imageUrl = post.small_image || 'https://via.placeholder.com/150';

        postCard.innerHTML = `
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <p class="release-date">${releaseDate}</p>
            <h3 class="post-title">${title}</h3>
            
        `;
        postsContainer.appendChild(postCard); 
    });
}



function setupPagination(meta) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; 

    
    const prevButton = document.createElement("button");
    prevButton.innerText = "❮"; 
    prevButton.classList.add("arrow");
    prevButton.disabled = currentPage === 1; 
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchData();
        }
    };
    paginationContainer.appendChild(prevButton); 

    
    const totalPages = meta.last_page; 
    const range = 5; 
    let startPage, endPage;

   
    if (totalPages <= range) {
        startPage = 1;
        endPage = totalPages;
    } else {
        startPage = Math.max(1, currentPage - Math.floor(range / 2));
        endPage = Math.min(totalPages, startPage + range - 1);
        

        if (endPage - startPage < range - 1) {
            startPage = Math.max(1, endPage - range + 1);
        }
    }

    
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement("button");
        pageLink.innerText = i;
        pageLink.classList.toggle("current-page", i === currentPage); 
        pageLink.style.fontSize = i === currentPage ? '1.5em' : '1em'; 

        pageLink.onclick = () => {
            currentPage = i;
            fetchData(); 
        };
        paginationContainer.appendChild(pageLink); 
    }

    
    const nextButton = document.createElement("button");
    nextButton.innerText = "❯"; 
    nextButton.classList.add("arrow");
    nextButton.disabled = currentPage === totalPages; 
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchData();
        }
    };

    paginationContainer.appendChild(nextButton); 
}


window.onscroll = function () {
    const scrollTop = window.scrollY;
    if (scrollTop > lastScrollTop) {
       
        header.style.transform = "translateY(-100%)"; 
    } else {
        
        header.style.transform = "translateY(0)";
        if (scrollTop > 50) {
            header.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; 
        } else {
            
            header.style.backgroundColor = "rgba(255, 136, 0, 1)"; 
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
};
