const {PropTypes} = React;

TodaysVote = React.createClass({
	subItems: [],
	getDatas: function(){
		var teamId = Meteor.user().profile.teamId;
		var todaysVote = Todays.findOne({teamId:teamId, status:1});
		var restaurantsIds = todaysVote? todaysVote.restaurants.map(i=>i.restaurantsId): [];
		return {
			restaurants: Restaurants.find({_id:{$in:restaurantsIds}}).fetch(),
			todaysVote: todaysVote
		}
	},
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return this.getDatas();
	},
	getInitialState: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		this.subItems.push(Meteor.subscribe('today', Meteor.user().profile.teamId));
		return this.getDatas();
	},
	componentWillMount: function(){},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	renderRestaurantItems: function() {
		var that = this;
		var getRestaurantInfo = function (page, restaurant) {
			var voteRestaurant = that.data.todaysVote.restaurants.find(i=>i.restaurantsId==restaurant._id);
			if (page == 1) return [
				["대표메뉴", restaurant.menus.map((i)=> {
					return i.menu
				}).join(", ")],
				["가격", String.fromCharCode(8361) + " " + restaurant.menus.reduce((m1, m2)=> {
					return m1 + parseInt(m2.price)
				}, 0) / restaurant.menus.length],
				["오픈~마감", restaurant.openTime + "  ~  " + restaurant.closeTime],
				["아이렝스타", _.range(3).map(i=><i
						className={i<restaurant.rating?"fa fa-star":"fa fa-star-o"}
						key={"star"+i}/>)]
			];
			else if (page == 2) return [
				["주소", restaurant.address],
				["인원", (voteRestaurant.partyMember.length)+"/"+voteRestaurant.maxMember]
			];
		};

		var restaurants = this.data.restaurants? this.data.restaurants: this.state.restaurants;
		return restaurants.map((restaurant)=>{
			return (
					<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={restaurant._id}>
						<RestaurantCard restaurant={restaurant} getRestaurantInfo={getRestaurantInfo} vote={true}/>
					</div>
			)
		});
	},
	render: function(){
		return this.data.todaysVote?(
				<div id="today-vote-page">
					<div className="header">
						<h1><i className="fa fa-cutlery"></i>오늘의 밥집</h1>
						<button type="button" className="btn btn-danger">안먹어요</button>
					</div>
					<div className="article">
						{this.renderRestaurantItems()}
					</div>
				</div>
		): (
				<div><h1>현재 진행 중인 투표가 없습니다</h1></div>
		);
	}
});