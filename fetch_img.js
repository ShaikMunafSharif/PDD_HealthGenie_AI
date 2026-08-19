fetch('https://html.duckduckgo.com/html/?q=Saveetha+Hospital+Chennai+Justdial').then(r=>r.text()).then(t=>{ 
  const m = t.match(/external-content\.duckduckgo\.com\/iu\/\?u=([^&\"']+)/g); 
  if (m) { 
    m.slice(0,5).forEach(x => console.log(decodeURIComponent(x.split('u=')[1]))) 
  } else console.log('not found') 
});
