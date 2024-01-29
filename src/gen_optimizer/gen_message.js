export default class GenMessage {
    constructor() {
        // 消息队列
        this.messageQueue = [];
        // 设置默认值
        this.position = 'top';
        this.message = '';
        this.type = '';
        this.duration = 3000;
        this.body = document.getElementsByTagName('body')[0];
        this.id = 0;
    }

    setType(messageDom, type) {
        if (type == '') {
            messageDom.classList.add('ui-message-info');
        } else if (type == 'success') {
            messageDom.classList.add('ui-message-success');
        } else if (type == 'warning') {
            messageDom.classList.add('ui-message-warning');
        } else if (type == 'error') {
            messageDom.classList.add('ui-message-error');
        } else {
            messageDom.classList.add('ui-message-info');// 默认值
        }
    }

    createIconDom(messageDom, type) {
        const i = document.createElement('i')
        i.classList.add('el-message__icon')
        let icon = 'el-icon-info'
        if (type == 'success') {
            icon = 'el-icon-success'
        } else if (type == 'warning') {
            icon = 'el-icon-warning'
        } else if (type == 'error') {
            icon = 'el-icon-error'
        }
        i.classList.add(icon)
        messageDom.appendChild(i)
    }

    createTextDom(messageDom, message) {
        const p = document.createElement('p');
        p.classList.add('message-content');
        p.textContent = message || this.message;
        messageDom.appendChild(p);
    }

    removeMessageDom(messageDom, targetId) {
        const startIndex = this.messageQueue.findIndex(message => message.id == targetId);
        this.messageQueue.splice(startIndex, 1);
        this.updateMessageDom(startIndex);
        //增加移除动画
        messageDom.classList.add('ui-message-leave');
        setTimeout(() => {
            this.body.removeChild(messageDom);
        }, 400);
    }

    setOption(options) {
        if (typeof options !== "object") {
            options = {};
        }
        const messageDom = document.createElement('div');
        messageDom.classList.add('ui-message');
        messageDom.classList.add('ui-message-leave');
        if (options.center == true) {
            messageDom.classList.add('ui-message-center');
        }
        const targetId = this.id;
        this.messageQueue.push({
            id: targetId,
            messageDom,
        });
        this.setType(messageDom, options.type);
        this.createIconDom(messageDom, options.type)
        this.createTextDom(messageDom, options.message);
        this.setCurrentMessageDom();
        this.body.appendChild(messageDom);
        //增加新增动画
        setTimeout(() => {
            messageDom.classList.remove('ui-message-leave');
        }, 100);
        let i = null;
        if (options.showClose == true) {
            i = document.createElement('i');
            i.classList.add('close-button');
            messageDom.appendChild(i);
        }
        const time = isNaN(Number(options.duration)) ? this.duration : Number(options.duration);
        // 如果duration为0则不需要setTimeout
        let timeId = -1;
        if (time !== 0) {
            timeId = setTimeout(() => {
                this.removeMessageDom(messageDom, targetId);
            }, time);
        }
        if (i != null && options.showClose == true) {
            i.addEventListener('click', () => {
                this.removeMessageDom(messageDom, targetId);
                if (targetId !== -1) {
                    clearTimeout(timeId);
                }
            });
        }
        this.id++;
    }

    setCurrentMessageDom() {
        const index = this.messageQueue.length - 1;
        const targetDom = this.messageQueue[index].messageDom;
        targetDom.style.zIndex = `${999999999 + index}`;
        targetDom.style.top = `${64 * index + 20}px`;
    }

    updateMessageDom(startIndex) {
        for (let i = startIndex; i < this.messageQueue.length; i++) {
            const messageDom = this.messageQueue[i].messageDom;
            messageDom.style.zIndex = `${2000 + i}`;
            // 暂不支持换行功能，换行后获取上一个元素的height和top来更新下一个元素的top
            messageDom.style.top = `${64 * i + 20}px`;
        }
    }

    error(content, duration = 2000) {
        this.setOption({
            message: content,
            type: "error",
            center: true,
            duration: duration,
        })
    }

    success(content, duration = 1000) {
        this.setOption({
            message: content,
            type: "success",
            center: true,
            duration: duration,
        })
    }

    warning(content) {
        this.setOption({
            message: content,
            type: "warning",
            center: true,
            duration: 2000,
        })
    }

    info(content) {
        this.setOption({
            message: content,
            type: "info",
            center: true,
            duration: 2000,
        })
    }
}