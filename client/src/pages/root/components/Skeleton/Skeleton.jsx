/* eslint-disable */

const skeleton = {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	render() {
		return (
			<div>
				{
					this.visible ? (
						<div >
							<a-skeleton active />
							<a-skeleton active />
						</div>
					) : null
				}
			</div>
		)
	}
}

export default skeleton
