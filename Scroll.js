/*class Scroll {
  constructor(totalHeight, distance, timer, scrollHeight) {
    this.totalHeight = totalHeight;
    this.distance = distance;
    this.timer = timer;
    this.scrollHeight = scrollHeight;
  }

   Scroll_(page) {
    function s(page){
    page.evaluate(async function() {
      await new Promise(function(resolve, reject) {
        this.timer = setInterval(() => {
          this.scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, this.distance);
          this.totalHeight += this.distance;
          if (this.totalHeight >= this.scrollHeight) {
            clearInterval(this.timer);
            resolve();
          }
        }, 70);
      });
    });
  }
}
*/
