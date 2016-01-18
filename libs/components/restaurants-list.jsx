RestaurantList = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return {
			restaurants: Restaurants.find({}).fetch()
		}
	},
	componentWillMount: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	renderRestaurantItems: function(){
		var getRestaurantInfo= function(page, restaurant){
			if (page==1) return[
					["대표메뉴", restaurant.menus.map((i)=>{return i.menu}).join(", ")],
					["가격", restaurant.menus.reduce((m1, m2)=>{return m1+parseInt(m2.price)}, 0)],
					["오픈~마감", restaurant.openTime+"  ~  "+restaurant.closeTime],
					["아이렝스타", restaurant.rating]
			];
			else if (page==2) return [

			];
		};

		return this.data.restaurants.map((restaurant)=>{
			return (
					<div className="col-xs-12 col-md-4 col-lg-3" key={restaurant._id}>
						<RestaurantCard restaurant={restaurant} getRestaurantInfo={getRestaurantInfo}/>
					</div>
			)
		});
	},
	render: function(){
		return (
				<div>{this.renderRestaurantItems()}</div>
		)
	}
});