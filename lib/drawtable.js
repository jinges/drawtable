'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DrawTable = function () {
    function DrawTable(title, reviceObject, titles, scoreList, baseColor) {
        _classCallCheck(this, DrawTable);

        this.title = title;
        this.reviceObject = reviceObject;
        this.titles = titles;
        this.scoreList = scoreList;
        this.baseColor = baseColor;
    }

    _createClass(DrawTable, [{
        key: 'init',
        value: function init() {
            var data = this.scoreList;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
            var ratio = devicePixelRatio / backingStoreRatio;
            this.ratio = ratio;
            this.canvas.width = this.pixelRatio((data[0].score.length + 3) * 100);
            this.canvas.height = this.pixelRatio(data.length * 60);
            this.ctx.scale(ratio, ratio);
            this.titles = ['序号', '姓名'].concat(_toConsumableArray(this.titles), ['总分']);
        }
    }, {
        key: 'drawFun',
        value: function drawFun(cb) {
            var height = this.drawTableHeader();
            this.canvas.height = this.canvas.height + this.pixelRatio(height + 100 + 40);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawTitle(this.title, this.reviceObject);
            this.drawTableHeader();
            this.drawTable(height);
            this.watermark(height);
            this.convertCanvasToImage(cb);
            this.closeImagePanel();
        }
    }, {
        key: 'pixelRatio',
        value: function pixelRatio(num) {
            return num; //* this.ratio
        }
    }, {
        key: 'drawTitle',
        value: function drawTitle(title, reviceObject) {
            this.ctx.fillStyle = this.baseColor;
            this.ctx.fillRect(this.pixelRatio(10), this.pixelRatio(10), this.canvas.width - this.pixelRatio(20), this.pixelRatio(120));
            this.ctx.font = this.pixelRatio(28) + 'px Microsoft YaHei';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(title, this.canvas.width / 2, this.pixelRatio(60));

            this.ctx.font = this.pixelRatio(22) + 'px Microsoft YaHei';
            this.ctx.fillText(reviceObject, (this.canvas.width - this.pixelRatio(20)) / 2, this.pixelRatio(100));
        }
    }, {
        key: 'drawTableHeader',
        value: function drawTableHeader() {
            var _this = this;
            var tableHeaderData = this.titles;
            var height = 0;
            var num = 8;
            _this.ctx.textBaseline = 'bottom';
            _this.ctx.textAlign = 'center';
            tableHeaderData.forEach(function (item, i) {
                var rows = Math.ceil(item.length / num);
                if (height < 22 * (rows + 1)) {
                    height = 22 * (rows + 1);
                }
                _this.ctx.fillStyle = '#bee9d3';
                _this.ctx.fillRect(_this.pixelRatio(10), _this.pixelRatio(120), _this.canvas.width - _this.pixelRatio(20), _this.pixelRatio(height));
            });

            tableHeaderData.forEach(function (item, i) {
                _this.ctx.font = _this.pixelRatio(22) + 'px Microsoft YaHei';
                var rows = Math.ceil(item.length / num);

                if (rows > 1) {
                    _this.ctx.font = _this.pixelRatio(16) + 'px Microsoft YaHei';
                    _this.ctx.textBaseline = 'bottom';
                    for (var j = 0; j < rows; j++) {
                        _this.ctx.fillStyle = '#000';
                        _this.ctx.fillText(item.substr(num * j, 8), _this.pixelRatio(100 * i + 50), _this.pixelRatio(150 + j * 22), _this.pixelRatio(100));
                    }
                } else {
                    _this.ctx.fillStyle = '#000';
                    _this.ctx.textBaseline = 'middle';
                    _this.ctx.fillText(item, _this.pixelRatio(100 * i + 50), _this.pixelRatio(120 + height / 2), _this.pixelRatio(100));
                }
            });
            return height;
        }
    }, {
        key: 'drawTable',
        value: function drawTable(height) {
            var _this = this;
            var canvas = this.canvas;
            var ctx = this.ctx;
            var data = this.scoreList;
            ctx.font = this.pixelRatio(20) + 'px Microsoft YaHei';
            ctx.textBaseline = 'bottom';
            this.arraySortFun(data);
            for (var i = 0, len = data.length; i < len; i++) {
                var top = 60 * i + 120 + height;
                if (i % 2 === 0) {
                    ctx.fillStyle = '#f8f8f8';
                    ctx.fillRect(this.pixelRatio(10), this.pixelRatio(top), canvas.width - this.pixelRatio(20), this.pixelRatio(60));
                }
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText(i + 1, this.pixelRatio(50), this.pixelRatio(top + 46));
                ctx.fillText(data[i].name, this.pixelRatio(100 + 50), this.pixelRatio(top + 46), this.pixelRatio(100));
                var score = data[i].score;
                var scoreLen = 0;
                score.forEach(function (item, key) {
                    ctx.fillStyle = '#000';
                    scoreLen++;
                    if (item == null) {
                        ctx.fillStyle = '#f00';
                        item = '未提交';
                    }
                    ctx.fillText(item, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100));
                });
                ctx.fillStyle = '#000';
                ctx.fillText(data[i].totalScore, this.pixelRatio(100 * (scoreLen + 2) + 50), this.pixelRatio(top + 46));
            }
            ctx.beginPath();
            ctx.strokeStyle = '#f8f8f8';
            ctx.lineWidth = this.pixelRatio(1);
            ctx.strokeRect(this.pixelRatio(10), this.pixelRatio(120 + height), canvas.width - this.pixelRatio(20), canvas.height - this.pixelRatio(20 + 120 + height));
            ctx.save();
        }
    }, {
        key: 'arraySortFun',
        value: function arraySortFun(data) {
            var temp = {};
            for (var i = 0, len = data.length; i < len; i++) {
                for (var j = data.length - 1; j > i; j--) {
                    if (data[j].totalScore > data[j - 1].totalScore) {
                        temp = data[j];
                        data[j] = data[j - 1];
                        data[j - 1] = temp;
                    }
                }
            }
            this.scoreList = data;
        }
    }, {
        key: 'watermark',
        value: function watermark(height) {
            var canvas = this.canvas;
            var ctx = this.ctx;
            ctx.font = this.pixelRatio(80) + 'px Microsoft YaHei';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(0,186,143,1)';
            ctx.globalAlpha = 0.1;
            ctx.rotate(-20 * Math.PI / 180);
            ctx.fillText('习习向上', canvas.width / 2 - this.pixelRatio(120), this.pixelRatio(height + 120 + 100));
        }
    }, {
        key: 'convertCanvasToImage',
        value: function convertCanvasToImage(cb) {
            var canvas = this.canvas;
            var image = new Image();
            var sHeight = window.screen.height;
            var sWidth = window.screen.width;
            var imgHeight = sWidth * canvas.height / canvas.width;

            var div = document.createElement('div');
            div.className = 'canvasImg';
            div.setAttribute('id', 'canvasImg');

            image.src = canvas.toDataURL('image/jpeg', 1);
            // image.className = 'canvasImg'
            div.appendChild(image);
            // let span = document.createElement('span')
            // span.innerHTML = '×'
            // span.className = 'close'
            // div.appendChild(span)
            document.body.appendChild(div);
            document.body.className = 'fixdBody';

            if (imgHeight < sHeight) {
                var h = (sHeight - imgHeight) / 2;
                document.querySelector('.canvasImg').firstElementChild.style.marginTop = h + 'px';
            }
        }
    }, {
        key: 'closeImagePanel',
        value: function closeImagePanel() {
            var closeBtn = document.getElementById('canvasImg');
            closeBtn.addEventListener('click', function () {
                document.body.lastElementChild.remove();
                document.body.className = '';
            }, true);
        }
    }]);

    return DrawTable;
}();

exports.default = DrawTable;