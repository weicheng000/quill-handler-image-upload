# 改寫Quill 的圖片上傳的設定

### 基底為Vue3 可根據需求改成Vue2

### 1. 首先在Quill的初始化程式，加入`handlers`設定，格式為`Object`。

```` javascript
onMounted(() => {
            editor.value = new Quill(editor.value, {
                modules: {
                    toolbar: {
                        //... 其他設定
                        handlers: { 'image': imageHandler }
                        // 加入這行，取代原本的圖片上傳邏輯
                    }
                },
                //... Another....
                theme: 'snow'
            });
        })
````

### 2. 編寫`imageHandler`方法，取代原生`Quill`的圖片上傳設定。

```` javascript
const imageHandler = function () {
            let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/gif, image/jpeg');
            input.click();
            // listening upload events
            input.onchange = () => {
                let file = input.files[0];
                if (/^image\//.test(file.type)) {
                    saveImage(file);
                } else {
                    alert('Image Only.');
                }
            };
        }
````
在這一步，我們在使用者`click`圖片上傳按鈕時，創造了一個圖片上傳按鈕。  
並用`javascript`點擊了這個被我們創造的按鈕`input`。 

在通過文件類型檢查時，執行下一步的方法 `saveImage`。

### 3. 編寫`saveImage`方法，將圖片上傳到後端。

```` javascript
const saveImage = function (file) {
            let fd = new FormData();
            fd.append('image', file);
        
            let url = '/api/image/posts';
            fetch(url, {
                method: 'POST',
                body: fd
            }).then(respose => respose.json()).then(res => {
                if (res.code == 1) {
                    insertImage(res.data)
                }
            })
        }
````

由於是手動處理上傳圖片邏輯。  
所以要將上階段收到的圖片，包裝成`FormData`物件。  
使用`POST`請求發送到後端的端口。  
這裡的後端需在圖片上傳至雲端或本地後，  
回傳圖片的url以便進行下一步的圖片插入邏輯。

### 4. 編寫`insertImage`方法，將圖片插入`Quill`編輯器當中。

```` javascript
/**
 * 插入圖片
 * @param {string} url 後端回傳的地址
 */
const insertImage = function (url) {
            let range = editor.value.getSelection();
            editor.value.insertEmbed(range.index, 'image', url)
        }
/** 
 * getSelection, insertEmbed 皆為：
 * Quill 物件的原生方法。
 */

````
`editor.value` 是vue3進行DOM綁定的語法，  
等價於：
```` javascript
const editor = document.getElementById('editor')
````
我們操作`editor` 調用其中的 `getSelection` 方法  
去得當前在編輯器光標的位置，  
並使用`insertEmbed` 方法將圖片以原生`url`的方式插入  
就此，改造完成。