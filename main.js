const GithubUsername = "MrLuto";

fetch(`https://api.github.com/users/${GithubUsername}/repos`)
    .then(response => response.json())
    .then(data => {
      let jsonResponse;
      try {
          jsonResponse = data;
      } catch (error) {
          // Handle parsing error
          console.error("Error parsing JSON response:", error);
          return false;
      }
    
      // Check if the response contains the key "message"
      if (jsonResponse && jsonResponse.hasOwnProperty("message")) {
          console.error(data);
          document.querySelector(".project-list").innerHTML += data.message;
          return true;
      } else {
          return false;
      }
      // Lus door de array met repositories
      data.forEach(repo => {
        const repoName = repo.name;
        var repoDescription = repo.description;
        const repoUrl = repo.html_url;
        if (repoDescription == null) repoDescription = "";
  
        // Een GET-verzoek naar de inhoud van de repository maken
        fetch(`https://api.github.com/repos/${GithubUsername}/${repoName}/contents`)
          .then(response => response.json())
          .then(contents => {
            // Zoek naar het bestand "thumbnail.webp" in de inhoud van de repository
            const thumbnailFile = contents.find(file => file.name === "thumbnail.webp");
  
            // Als het bestand is gevonden, log de URL
            var thumbnailUrl = "./assets/images/noimg.webp";
            if (thumbnailFile) {
              thumbnailUrl = thumbnailFile.download_url;
              console.log(`Thumbnail URL voor ${repoName}: ${thumbnailUrl}`);
            }
            const projectItem = `<li class="project-item active"><a href="${repoUrl}" target="_blank" aria-label="${repoName}"><figure class="project-img"><div class="project-item-icon-box"><ion-icon name="logo-github"></ion-icon></div><img src="${thumbnailUrl}" alt="Github" width="600" height="400" loading="lazy"></figure><h3 class="project-title">${repoName}</h3><p class="project-category">${repoDescription}</p></a></li>`;
            document.querySelector(".project-list").innerHTML += projectItem;
            console.log("---");
          })
          .catch(error => {
            console.error(`Fout bij het ophalen van de inhoud van ${repoName}:`, error);
          });
      });
    })
    .catch(error => {
      console.error("Er is een fout opgetreden:", error);
    });