import { ref, onMounted } from 'vue'

export default {
    template:`
        <div ref="editor"></div>
    `,
    setup(){
        const editor = ref();

        const imageHandler = function () {
            let input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
            input.click();
            // listen upload events
            input.onchange = () => {
                let file = input.files[0];
                if (/^image\//.test(file.type)) {
                    saveImage(file);
                } else {
                    alert('Image Only.');
                }
            };
        }
        
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
        
        const insertImage = function (url) {
            let range = editor.value.getSelection();
            editor.value.insertEmbed(range.index, 'image', url)
        }

        onMounted(() => {
            editor.value = new Quill(editor.value, {
                modules: {
                    toolbar: {
                        container: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike',],
                            ['blockquote', 'code-block', 'link', 'image',],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
                        ],
                        handlers: { 'image': imageHandler }
                    }
                },
                placeholder: 'Compose an epic...',
                readOnly: false,
                theme: 'snow'
            });
        })
        return{
            editor
        }
    }
}