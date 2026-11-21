/* Contact Studio V4: progressive enhancement, local drafts, and email-client handoff. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const form=$('#contactForm');if(!form)return;
const MAIL='ashimabhasin489@gmail.com';
const STORE='ab-contact-draft-v4';
const fields={name:$('#senderName'),email:$('#senderEmail'),subject:$('#senderSubject'),message:$('#senderMessage')};
const topicButtons=[...document.querySelectorAll('[data-topic]')];
const configs={
 opportunity:{label:'Software engineering opportunity',subject:'Software engineering opportunity',starter:'Hi Ashima,\n\nI’m reaching out about a software engineering opportunity. Here are some details about the role and team:\n\n'},
 collaboration:{label:'Project collaboration',subject:'Let’s collaborate on a project',starter:'Hi Ashima,\n\nI have a project idea I’d like to discuss with you:\n\n'},
 research:{label:'Research conversation',subject:'Research collaboration inquiry',starter:'Hi Ashima,\n\nI’d like to connect about a research topic:\n\n'},
 hello:{label:'Hello',subject:'Hello from your portfolio',starter:'Hi Ashima,\n\nI came across your portfolio and wanted to say hello!\n\n'}
};
let topic='opportunity',subjectSuggested=false,starterInserted=false;
const feedback=$('#formFeedback'), draftStatus=$('#draftStatus');
const status=(text,bad=false)=>{feedback.textContent=text;feedback.classList.toggle('error',bad)};
const notify=text=>{const node=$('#toast');if(node){node.textContent=text;node.classList.add('visible');setTimeout(()=>node.classList.remove('visible'),2600)}else status(text)};
const raw=()=>({name:fields.name.value,email:fields.email.value,subject:fields.subject.value,message:fields.message.value,topic});
const sendText=()=>`Hi Ashima,\n\n${fields.message.value.trim().replace(/^Hi Ashima,\s*/i,'')}\n\n— ${fields.name.value.trim()}\nReply email: ${fields.email.value.trim()}`;
const subjectLine=()=>`[Portfolio / ${configs[topic].label}] ${fields.subject.value.trim()}`;
function setTopic(key,{suggest=true}={}){
 if(!configs[key])return;
 const prev=topic;topic=key;
 topicButtons.forEach(b=>{const yes=b.dataset.topic===key;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes))});
 // Only replace text that was introduced by the tool. Never silently overwrite a user's writing.
 if(suggest){
   if(!fields.subject.value.trim()||subjectSuggested){fields.subject.value=configs[key].subject;subjectSuggested=true;}
   if(!fields.message.value.trim()||(starterInserted&&fields.message.value===configs[prev].starter)){fields.message.value=configs[key].starter;starterInserted=true;}
 }
 updateMeter();
}
function setError(key,message){
 const input=fields[key],error=$('#'+input.id+'Error');
 if(error)error.textContent=message;
 input.classList.toggle('input-invalid',!!message);
 input.setAttribute('aria-invalid',String(!!message));
}
function checkField(key){
 const value=fields[key].value.trim();let error='';
 if(!value)error='This field is required.';
 else if(key==='name'&&value.length<2)error='Please enter at least 2 characters.';
 else if(key==='email'&&(!fields.email.validity.valid||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)))error='Enter a valid email address.';
 else if(key==='subject'&&value.length<4)error='Please add a descriptive subject.';
 else if(key==='message'&&value.length<20)error='Please write at least 20 characters.';
 else if(fields[key].validity.tooLong)error='This field is too long.';
 setError(key,error);return !error;
}
function validate(){const keys=Object.keys(fields),ok=keys.map(checkField);if(ok.includes(false)){fields[keys[ok.indexOf(false)]].focus();status('Please correct the highlighted fields before continuing.',true);return false;}status('');return true;}
function updateMeter(){const value=fields.message.value.trim().length;$('#messageCounter').textContent=`${value} / 2000`;$('#messageMeterFill').style.width=`${Math.min(100,value/2000*100)}%`;}
Object.keys(fields).forEach(key=>{
 fields[key].addEventListener('input',()=>{if(key==='subject')subjectSuggested=false;if(key==='message'){starterInserted=false;updateMeter()}if(fields[key].getAttribute('aria-invalid')==='true')checkField(key);status('')});
 fields[key].addEventListener('blur',()=>{if(fields[key].value.trim())checkField(key)})
});
topicButtons.forEach(b=>b.addEventListener('click',()=>setTopic(b.dataset.topic)));
$('#suggestSubject').addEventListener('click',()=>{fields.subject.value=configs[topic].subject;subjectSuggested=true;setError('subject','');fields.subject.focus();notify('Subject suggestion added')});
$('#saveDraft').addEventListener('click',()=>{
 try{localStorage.setItem(STORE,JSON.stringify({...raw(),savedAt:Date.now()}));draftStatus.textContent='Saved on this device · '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});notify('Draft saved in this browser only')}catch{draftStatus.textContent='Unable to save locally';notify('Browser storage is unavailable')}
});
$('#clearDraft').addEventListener('click',()=>{
 if(Object.values(fields).some(el=>el.value.trim())&&!confirm('Clear the form and any saved draft?'))return;
 form.reset();Object.keys(fields).forEach(key=>setError(key,''));setTopic('opportunity',{suggest:false});subjectSuggested=false;starterInserted=false;status('');updateMeter();
 try{localStorage.removeItem(STORE)}catch{}draftStatus.textContent='Form reset. Nothing saved.';notify('Form cleared');
});
try{const stored=JSON.parse(localStorage.getItem(STORE)||'null');if(stored&&typeof stored==='object'){
 ['name','email','subject','message'].forEach(key=>{if(typeof stored[key]==='string')fields[key].value=stored[key].slice(0,fields[key].maxLength>0?fields[key].maxLength:4000)});
 setTopic(stored.topic||'opportunity',{suggest:false});subjectSuggested=false;starterInserted=false;
 draftStatus.textContent='Saved draft restored from this device';
}}catch{draftStatus.textContent='Local draft unavailable'}
updateMeter();
const preview=$('#messagePreview');
function fillPreview(){if(!validate())return false;$('#previewFrom').textContent=`${fields.name.value.trim()} <${fields.email.value.trim()}>`;$('#previewSubject').textContent=subjectLine();$('#previewBody').textContent=sendText();return true}
$('#previewMessage').addEventListener('click',()=>{if(fillPreview()){if(preview.showModal)preview.showModal();else status('Preview is not supported in this browser. You can still open your email app.')}});
$('#closePreview').addEventListener('click',()=>preview.close());preview.addEventListener('click',e=>{if(e.target===preview)preview.close()});
function buildMailto(){return `mailto:${MAIL}?subject=${encodeURIComponent(subjectLine())}&body=${encodeURIComponent(sendText())}`}
function openMail(){if(!validate())return;status('Your email app should open with a draft. Please review it and press Send there.');window.location.href=buildMailto()}
form.addEventListener('submit',e=>{e.preventDefault();openMail()});$('#previewSend').addEventListener('click',()=>{preview.close();openMail()});
async function copy(value){try{await navigator.clipboard.writeText(value);notify('Copied to clipboard')}catch{notify('Copy unavailable. Please select and copy the text manually.')}}
$('#copyEmail').addEventListener('click',()=>copy(MAIL));
$('#copyMessage').addEventListener('click',()=>{if(fillPreview())copy(`To: ${MAIL}\nFrom: ${fields.name.value.trim()} <${fields.email.value.trim()}>\nSubject: ${subjectLine()}\n\n${sendText()}`)});
$('#downloadMessage').addEventListener('click',()=>{
 if(!fillPreview())return;
 const content=`To: ${MAIL}\nFrom: ${fields.name.value.trim()} <${fields.email.value.trim()}>\nSubject: ${subjectLine()}\n\n${sendText()}`;
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='portfolio-message-draft.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Message draft downloaded');
});
})();
