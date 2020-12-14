module.exports = {
    generateGradient: function (grad) {
		if(grad == 0) {
			return ['red', 'rgb(251, 250, 245)', 'green', 'rgb(251, 250, 245)'];				// Christmas
		} else if(grad == 1) {
			return ['rgb(255, 90, 0)', 'rgb(251, 250, 245)', 'yellow', 'rgb(251, 250, 245)'];	// Thanksgiving
		} else if(grad == 2) {
			return ['green', 'rgb(252,113,217)', 'yellow', 'rgb(251, 250, 245)'];			// Easter
		} else if(grad == 3) {
			return ['rgb(255, 90, 0)', 'green', 'purple', 'yellow'];// Halloween
		} else if(grad == 4) {
			return ['purple', {r: 0, g: 128, b: 128}, 'rgb(251, 250, 245)']		// Moms Favorite
		}
	},
}