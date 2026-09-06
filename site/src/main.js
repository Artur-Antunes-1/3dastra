import {steps,cases,useCases,installation} from './content.js';

const $ = id => document.getElementById(id);
let currentStep=0;
let activeUsecase='world';
let statusTimer;
const imagePath = name => `/images/${name}`;

function notify(message){clearTimeout(statusTimer);$('status-message').textContent=message;$('status-message').classList.add('visible');statusTimer=setTimeout(()=>$('status-message').classList.remove('visible'),4200)}
function selectTab(button){const group=button.closest('[role="tablist"]');group.querySelectorAll('[role="tab"]').forEach(tab=>{tab.setAttribute('aria-selected',String(tab===button));tab.tabIndex=tab===button?0:-1});$(button.getAttribute('aria-controls')).setAttribute('aria-labelledby',button.id)}
function wireTabs(group,action){const tabs=[...group.querySelectorAll('[role="tab"]')];tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>{selectTab(tab);action(tab)});tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();tabs[next].click()})})}
function renderStep(index){currentStep=index;const step=steps[index];$('step-title').textContent=step.title;$('step-description').textContent=step.description;$('step-deliverable').textContent=step.deliverable;$('step-image').src=imagePath(step.image);$('step-image').alt=step.alt;$('step-caption').textContent=step.caption;$('step-count').textContent=`${String(index+1).padStart(2,'0')} / 06`;$('next-step').innerHTML=index===steps.length-1?'Back to direction <span aria-hidden="true">↗</span>':'Next stage <span aria-hidden="true">↗</span>'}
wireTabs(document.querySelector('.method-tabs'),tab=>renderStep(Number(tab.dataset.step)));
$('next-step').addEventListener('click',()=>{const next=(currentStep+1)%steps.length;const tab=$(`step-tab-${next}`);selectTab(tab);renderStep(next)});

wireTabs($('case-tree').closest('[role="tablist"]'),tab=>{const data=cases[tab.dataset.case];$('case-concept').src=imagePath(data.concept);$('case-concept').alt=data.conceptAlt;$('case-implementation').src=imagePath(data.implementation);$('case-implementation').alt=data.implementationAlt;$('case-concept-caption').textContent=data.conceptCaption;$('case-left-type').textContent=data.leftType;$('case-implementation-caption').textContent=data.implementationCaption;$('case-subtitle').textContent=data.title;$('case-description').textContent=data.description;$('case-note').textContent=data.note;$('case-concept').closest('button').setAttribute('aria-label',`Enlarge ${data.conceptAlt}`);$('case-implementation').closest('button').setAttribute('aria-label',`Enlarge ${data.implementationAlt}`)});
wireTabs($('install-codex').closest('[role="tablist"]'),tab=>{const data=installation[tab.dataset.install];$('installation-steps').innerHTML=data.steps.map(step=>`<li>${step}</li>`).join('');$('installation-note').textContent=data.note});

function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open')}
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close()})}
document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>{const img=button.querySelector('img');$('expanded-image').src=img.src;$('expanded-image').alt=img.alt;$('image-dialog-title').textContent=img.alt;openDialog($('image-dialog'))}));
function fillList(element,items){element.replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li}))}
document.querySelectorAll('[data-usecase]').forEach(button=>button.addEventListener('click',()=>{activeUsecase=button.dataset.usecase;const data=useCases[activeUsecase];$('usecase-category').textContent=data.category;$('usecase-title').textContent=data.title;$('usecase-description').textContent=data.description;$('usecase-image').src=imagePath(data.image);$('usecase-image').alt=data.alt;fillList($('usecase-references'),data.references);fillList($('usecase-checks'),data.checks);openDialog($('usecase-dialog'))}));

function renderPrompt(){const kind=$('project-type').value;const data=useCases[kind];const idea=$('project-idea').value.trim();const selected=$('has-target').checked;$('copy-prompt').disabled=!idea;$('target-help').textContent=selected?'Attach the chosen image to your request. The agent starts from that direction.':'The agent starts by generating visual alternatives for you to choose from.';
  if(!idea){$('prompt-output').textContent='Describe your idea to prepare a prompt.';return}
  const start=selected?'Use the attached image as the already chosen visual target. Preserve its identity and proceed with the necessary production references, without restarting the style selection.':'Start by generating a few concept images with distinct visual directions and comparable framing. Present the images and wait for my choice before detailing the models.';
  $('prompt-output').textContent=`Use $3dastra to create this project:\n\n${idea}\n\n${start}\n\nOnce the target is defined, build the volumes and camera first. Refine materials and lighting, compare captures with the reference, and address the largest mismatches.\n\n${data.validation}\n\nDeliver the relevant files, comparable captures, and checks actually performed, identifying any remaining differences.`;
}
$('brief-form').addEventListener('submit',event=>event.preventDefault());
$('project-idea').addEventListener('input',renderPrompt);$('has-target').addEventListener('change',renderPrompt);
$('project-type').addEventListener('change',()=>{$('project-idea').value=useCases[$('project-type').value].idea;renderPrompt()});
$('usecase-apply').addEventListener('click',()=>{$('usecase-dialog').close();$('project-type').value=activeUsecase;$('project-idea').value=useCases[activeUsecase].idea;renderPrompt();$('brief-form').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});$('project-type').focus({preventScroll:true})});
$('copy-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('prompt-output').textContent);notify('Prompt copied. Bring it to your AI agent.')}catch{const range=document.createRange();range.selectNodeContents($('prompt-output'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);notify('Text selected. Use Copy to bring it to your agent.')}});
renderPrompt();

function closeMenu(){document.querySelector('.site-header').classList.remove('menu-open');$('menu-button').setAttribute('aria-expanded','false');$('menu-button').setAttribute('aria-label','Open menu')}
$('menu-button').addEventListener('click',()=>{const expanded=$('menu-button').getAttribute('aria-expanded')!=='true';document.querySelector('.site-header').classList.toggle('menu-open',expanded);$('menu-button').setAttribute('aria-expanded',String(expanded));$('menu-button').setAttribute('aria-label',expanded?'Close menu':'Open menu')});
document.querySelectorAll('#navigation a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('menu-button').getAttribute('aria-expanded')==='true'){closeMenu();$('menu-button').focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
window.addEventListener('resize',()=>{if(window.innerWidth>700)closeMenu()});
$('share-site').addEventListener('click',async()=>{const url=new URL('/',location.href).href;try{if(navigator.share){await navigator.share({title:'3DASTRA — Picture it. Then build it.',text:'An image-first skill for creating 3D with visual direction.',url})}else{await navigator.clipboard.writeText(url);notify('3DASTRA link copied.')}}catch(error){if(error.name!=='AbortError')notify('Copy the browser address to share this page.')}});
