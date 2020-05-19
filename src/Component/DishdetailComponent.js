import React  from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, FormGroup, Label, ModalBody} from 'reactstrap'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const maxLength = (len) => (val) => !(val) || (val.length<=len);
const minLength = (len) => (val) => (val) && (val.length>=len);

class CommentForm extends React.Component {

      constructor(props){
        super(props);
        this.state = {

          isModalOpen: false
        };
          this.handleSubmit = this.handleSubmit.bind(this);
          this.toggleModal = this.toggleModal.bind(this);

 }

 toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
      this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
      this.toggleModal();

  }

  render () {
      return (
      <>
        <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit Comments</Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader isOpen={this.state.isModalOpen} toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
                <FormGroup className="form-group">
                    <Label htmlFor="rating" md={2}>Rating</Label>
                        <Control.select model=".rating" id="rating" name="firstname"
                            className="form-control">
                                <option>{1}</option>
                                <option>{2}</option>
                                <option>{3}</option>
                                <option>{4}</option>
                                <option>{5}</option>
                            </Control.select>
                </FormGroup>
                <FormGroup className='form-group'>
                                <Label htmlFor='author' >Your name</Label>
                                <Control.text model='.author' id='author' name='author' placeholder='Your name'
                                    className='form-control'
                                    validators={{maxLength: maxLength(15),minLength: minLength(3)}}/>
                                <Errors
                                className='text-danger'
                                model='.author'
                                show='touched'
                                messages={{
                                    maxLength: 'Must be 15 characters or less',
                                    minLength: 'Must be greater than 2 characters'
                                }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor='comment' md={2}>Comment</Label>
                                <Control.textarea model='.comment' id='comment' name='comment'
                                    rows="6"
                                    className='form-control' />
                            </FormGroup>
                            <FormGroup>
                                <Button type='submit' color="primary">Submit</Button>
                            </FormGroup>
              </LocalForm>
            </ModalBody>
        </Modal>
    </>
);
  }

}

   function RenderComments({comments, postComment, dishId}){

     if (comments == null) {
           return (<div></div>)
       }

       const cmnts = comments.map(comment => {
           return (

               <li key={comment.id}>

                   <p>{comment.comment}</p>
                   <p>-- {comment.author},
                   &nbsp;
                   {new Intl.DateTimeFormat('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: '2-digit'
                       }).format(new Date(Date.parse(comment.date)))}
                   </p>

               </li>

           )


       })
       return (
          <Stagger in>
            <div className="col-12 col-md-5 m-1">

               <h4> Comments </h4>
               <Fade in>
               <ul className='list-unstyled'>
                   {cmnts}
               </ul>
                 </Fade>
                 <CommentForm dishId={dishId} postComment={postComment}/>

           </div>
           </Stagger>
       )


   }

   function RenderDish({dish}) {


       return(
          <div className="col-12 col-md-5 m-1">
          <FadeTransform
              in
              transformProps={{
                  exitTransform: 'scale(0.5) translateY(-50%)'
              }}>
               <Card>
                   <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                   <CardBody>
                     <CardTitle>{dish.name}</CardTitle>
                     <CardText>{dish.description}</CardText>
                   </CardBody>
               </Card>
            </FadeTransform>
           </div>
       );

   }
   const DishDetail = (props) => {
        if(props.isLoading) {
           return(
                <div className='container'>
                    <div className='row'>
                        <Loading />
                    </div>
                </div>
           );
        }
         else if (props.errMess) {
           return (
               <div className='container'>
                   <div className='row'>
                       <h4>{props.errMss}</h4>
                   </div>
               </div>
             );
         }
        else if (props.dish != null) {
            return (
            <div className="container">
                <div className="row">
                       <Breadcrumb>
                           <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                           <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                       </Breadcrumb>
                       <div className="col-12">
                           <h3>{props.dish.name}</h3>
                           <hr />
                       </div>
                  </div>
                <div className="row">
                  <RenderDish dish ={props.dish} />
                   <RenderComments comments = {props.comments}
                        postComment= {props.postComment}
                        dishId = {props.dish.id}/>

                </div>
            </div>
            )
        }
        else{

      return (
             <div>
            </div>
          );
         }

  }


export default DishDetail;
