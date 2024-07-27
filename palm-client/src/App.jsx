import { useState, useRef } from 'react'
import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({
  gfm: true,
})


function App() {
const [serverData, setServerData] = useState([{}]);
const [userPrompt, setUserPrompt] = useState('');
const inputRef = useRef(null);


function handleSubmit(){
  setServerData('');
if(userPrompt !== ''){
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({'prompt': userPrompt}),
  })
  .then((res) => res.json())
  .then((data) => {
    const html = DOMPurify.sanitize(marked(data));
    setServerData({...data, html});
    inputRef.current.focus();
    setUserPrompt('');
    }).catch((err) => {
      const html = DOMPurify.sanitize(marked(err));
      setServerData({...data, html});
      inputRef.current.focus();
      setUserPrompt('');
    })
  } 
}

function handleOnchange(e){
  setUserPrompt(e.target.value);
}

function handleKeyDown(e){
  if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      inputRef.current.blur();
      handleSubmit();
  }
}

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{padding: '10px', marginBottom: '0'}}>MY GPT</h1>
      <div style={{margin: '0', flexGrow: '1', overflow: 'scroll'}}>
        <div style={{width: '100%', height:'100%'}}>
          {
            (serverData === '') ? ('Loading...')
             : <article style={{margin: '0'}} dangerouslySetInnerHTML={{__html: serverData.html}} />}
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'flex-end', backgroundColor: '#222', padding: '10px'}}>
        <textarea 
        onChange={(e) => handleOnchange(e)}
        onKeyDown={handleKeyDown} ref={inputRef} value={userPrompt}
        style={{margin: '0', flexGrow: '1', overflow: 'hidden'}} placeholder='Enter a text...'
        />
        <button 
        onClick= {handleSubmit} 
        style={{margin: '0', flex: '1', marginLeft: '10px'}}>
          Go
        </button>
      </div>
    </main>
  )
}

export default App
