// console.log("This is Index");

document.querySelector("#submit").addEventListener("click", () => {
  let url = document.querySelector("#url").value;
  let env = document.querySelector("#env").value;
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  document.querySelector("#submit").innerHTML = "Asking access token...";
  document.querySelector("#submit").setAttribute("disabled", "disabled");

  fetch("https://partners.platformos.com/api/user_tokens", {
    headers: { UserAuthorization: email + ":" + password, InstanceDomain: url },
  })
    .then((response) => {
      console.log(response);
      if (response.status == 401) {
        alert("Unauthorized, plese check your email and / or password!");

        throw new Error(
          "Unauthorized, plese check your email and / or password!"
        );
      }

      return response.json();
    })
    .then((data) => {
      let pos = {
        env: env,
        url: url,
        token: data[0].token,
        email: email,
      };

      chrome.storage.sync.set(pos, () => {
        document.location.href = chrome.runtime.getURL("access_token.html");
      });
    })
    .catch((error) => {
      document.querySelector("#submit").innerHTML = "Submit";
      document.querySelector("#submit").removeAttribute("disabled");
    });
});
