Vue.component('header-bar', { 
	template: '<div style="background: #2d8cf0; height: 50px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">' +
			'<Icon :type="icon" size="28" color="white" @click.native="showDrawer" style="cursor: pointer; margin-left: 10px;"></Icon>' +
			'<div style="flex: 1; color: white; font-size: 20px; margin-left: 10px;">{{title}}</div>' + 
			'<slot name="right"></slot>' +
		'</div>'
	,
	props: {
		title: String,
		icon: {
			type: String,
			default: 'md-menu',
			require: true
		}, // ios-arrow-back
	},
	data() {
		return {
		};
	},
	created(){
	},
	mounted(){
	},
	destroyed(){
  },
	methods: {
		showDrawer(params) {
			vm.showDrawer();
		}
	}
});
