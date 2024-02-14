var $slider = $('#range').get(0);
var $min = $('#min'); //最小値のテキストフィールド
var $max = $('#max'); //最大値のテキストフィールド
var minVal = 0; //最小値
var maxVal = 1000; //最大値
var gap = 5; // 数値を5刻みにする
//noUiSliderをセット
noUiSlider.create($slider, {
  start: [ minVal - gap, maxVal + gap ], //
  connect: true,
  step: gap,
  range: {
    'min': minVal - gap, //最小値を-5
    'max': maxVal + gap  //最小値を+5
  },
  pips: {
    mode: 'range',
    density: gap
  }
});

//noUiSliderイベント
$slider.noUiSlider.on('update', function( values, handle ) {

  //現在の最小値・最大値を取得
  var value = Math.floor(values[handle]);

  if ( handle ) {
    $max.get(0).value = value; //現在の最大値
  } else {
    $min.get(0).value = value; //現在の最小値
  }

  //noUiSlider下部の数値変更（そのままだと+-5の数値が表示されるため）
  $('.noUi-value-large').text(minVal);
  $('.noUi-value-large:last-child').text(maxVal);

  //最小値以下・最大値以上でinputを空にする
  if ( $min.get(0).value <= minVal || $min.get(0).value > maxVal ){
    $min.val('');
  }
  if ( $max.get(0).value <= minVal || $max.get(0).value > maxVal ){
    $max.val('');
  }

});

//最小値をinputにセット
$min.get(0).addEventListener('change', function(){
  $slider.noUiSlider.set([this.value, null]);
});

//最大値をinputにセット
$max.get(0).addEventListener('change', function(){
  $slider.noUiSlider.set([null, this.value]);
});