module.exports = {
    generateGradient: function (grad) {
		if(grad == 0) {
			return ['red', 'rgb(239, 235, 216)', 'green', 'rgb(239, 235, 216)'];				// Christmas
		} else if(grad == 1) {
			return ['rgb(255, 90, 0)', 'white', 'yellow', 'white'];	// Thanksgiving
		} else if(grad == 2) {
			return ['green', 'rgb(252,113,217)', 'yellow', 'white'];			// Easter
		} else if(grad == 3) {
			return ['rgb(255, 90, 0)', 'green', 'purple', 'yellow'];// Halloween
		} else if(grad == 4) {
			return ['purple', {r: 0, g: 128, b: 128}, 'white']		// Moms Favorite
		} else if(grad == 5) {
			return ['red', 'green', 'red', 'green']		// Xmas 2: electric boogalo
		}
	},
}