// --- 헬퍼 함수: 이미지 비율 자동 계산 (Manual Cover) ---
function fitImage(img) {
    const wrapper = img.parentElement;
    if (!wrapper || !img.src) return;

    const wRatio = wrapper.clientWidth / wrapper.clientHeight;
    const iRatio = img.naturalWidth / img.naturalHeight;
    if (iRatio > wRatio) {
        img.style.width = 'auto';
        img.style.height = '100%';
    } else {
        img.style.width = '100%';
        img.style.height = 'auto';
    }
}

// --- 헬퍼 함수: 파일 업로드 및 붙여넣기 처리 ---
function setupImageHandlers(uploadId, pasteId, imgId, placeholderId, isSticker = false) {
    const input = document.getElementById(uploadId);
    const pasteBtn = document.getElementById(pasteId);
    const imgElement = document.getElementById(imgId);
    const ph = placeholderId ? document.getElementById(placeholderId) : null;
    const wrapper = isSticker ? null : imgElement.parentElement;

    const applyImage = (url) => {
        imgElement.src = url;
        imgElement.onload = () => {
            imgElement.style.display = 'block';
            if (!isSticker) {
                wrapper.style.display = 'flex';
                fitImage(imgElement);
            }
            if (ph) ph.style.display = 'none';
        };
    };

    // 1. 파일 업로드 이벤트
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                applyImage(evt.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. 클립보드 붙여넣기 이벤트
    pasteBtn.addEventListener('click', async function() {
        try {
            const items = await navigator.clipboard.read();
            let imageFound = false;

            for (const item of items) {
                const imageType = item.types.find(type => type.startsWith('image/'));
                if (imageType) {
                    const blob = await item.getType(imageType);
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        applyImage(evt.target.result);
                    };
                    reader.readAsDataURL(blob);
                    imageFound = true;
                    break; 
                }
            }

            if (!imageFound) alert("클립보드에서 이미지를 찾을 수 없습니다.");
        } catch (err) {
            console.error("붙여넣기 오류:", err);
            alert("이미지 붙여넣기에 실패했습니다.");
        }
    });
}

// --- 헬퍼 함수: 텍스트 동기화 ---
function syncText(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    input.addEventListener('input', () => display.innerText = input.value);
}

// --- 헬퍼 함수: 토글 가시성 ---
function toggleVisibility(checkId, elementId) {
    const checkbox = document.getElementById(checkId);
    const element = document.getElementById(elementId);
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) element.classList.remove('hidden');
        else element.classList.add('hidden');
    });
}

// --- 초기화 실행 ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 이미지 연결
    setupImageHandlers('input-fullbody', 'paste-fullbody', 'disp-fullbody', 'ph-fullbody');
    setupImageHandlers('input-headshot', 'paste-headshot', 'disp-headshot', 'ph-headshot');
    setupImageHandlers('input-album', 'paste-album', 'disp-album', 'ph-album');
    setupImageHandlers('input-motif1-img', 'paste-motif1', 'disp-motif1', 'ph-motif1');
    setupImageHandlers('input-motif2-img', 'paste-motif2', 'disp-motif2', 'ph-motif2');
    setupImageHandlers('input-motif3-img', 'paste-motif3', 'disp-motif3', 'ph-motif3');
    
    // 스티커는 일반 img 처리
    setupImageHandlers('input-sticker', 'paste-sticker', 'disp-sticker', null, true);

    // 2. 텍스트 연결
    syncText('input-name', 'disp-name');
    syncText('input-subname', 'disp-subname');
    syncText('input-song', 'disp-song');
    syncText('input-artist', 'disp-artist');
    syncText('input-motif1-text', 'disp-motif1-text');
    syncText('input-motif2-text', 'disp-motif2-text');
    syncText('input-motif3-text', 'disp-motif3-text');
    syncText('input-comment', 'disp-comment');
            
    syncText('input-fullbody-source', 'disp-fullbody-source');
    syncText('input-headshot-source', 'disp-headshot-source');

    // 3. 토글 연결
    toggleVisibility('check-name', 'module-header');
    toggleVisibility('check-subname', 'disp-subname');
    toggleVisibility('check-headshot', 'module-headshot');
    toggleVisibility('check-music', 'module-music');
    toggleVisibility('check-motif1', 'module-motif1');
    toggleVisibility('check-motif2', 'module-motif2');
    toggleVisibility('check-motif3', 'module-motif3');
    toggleVisibility('check-comment', 'module-comment');
    toggleVisibility('check-sticker', 'module-sticker');

    // 전신 이미지 토글
    const checkFullbody = document.getElementById('check-fullbody');
    const moduleFullbody = document.getElementById('module-fullbody');
    const canvasArea = document.getElementById('canvas-area');
    if (!checkFullbody.checked) {
        moduleFullbody.classList.add('hidden');
        canvasArea.classList.add('no-fullbody');
    }
    checkFullbody.addEventListener('change', function() {
        if (this.checked) {
            moduleFullbody.classList.remove('hidden');
            canvasArea.classList.remove('no-fullbody');
        } else {
            moduleFullbody.classList.add('hidden');
            canvasArea.classList.add('no-fullbody');
        }
    });

    // 4. 배경 및 폰트 설정 연결
    const bgSelect = document.getElementById('bg-select');
    bgSelect.addEventListener('change', function(e) {
        canvasArea.classList.remove('bg-pattern-grid', 'bg-pattern-paper', 'bg-pattern-dot', 'bg-pattern-solid', 'bg-pattern-dark');
        canvasArea.classList.add(e.target.value);
    });

    const fontSelect = document.getElementById('font-select');
    fontSelect.addEventListener('change', function(e) {
        canvasArea.classList.remove('font-theme-default', 'font-theme-serif', 'font-theme-cute');
        canvasArea.classList.add(e.target.value);
    });
});

// --- 이미지 저장 기능 ---
function downloadImage() {
    const canvasArea = document.getElementById('canvas-area');
    const btn = document.querySelector('.download-btn');
    const originalText = btn.innerText;

    btn.innerText = "이미지 생성 중...";
    btn.disabled = true;

    window.scrollTo(0,0);

    html2canvas(canvasArea, {
        scale: 2,
        backgroundColor: null, 
        useCORS: true,
        scrollX: 0,
        scrollY: 0, 
        height: canvasArea.scrollHeight,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-oc-motif.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        btn.innerText = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("캡처 에러:", err);
        alert("이미지 저장 중 오류가 발생했습니다.");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}