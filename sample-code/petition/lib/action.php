<?php
	session_start();
	include_once "db.php";
	include_once "lqc_function.php";
	@define ( '_lib' , '../../admin/lib/');
	include_once _lib."constant.php";

	//================================================ Petition Registration =============================================
	//get image petition after successful registration
	if(isset($_POST['getImgRequire'])){
		$row = $_SESSION['LegalRegistration'];
		echo '<div class="petition_image">
    			<img id="img_pet_letter" src="legal300/upload/images/'.$row['pet_image'].'" alt="">
    		</div>
    		<div class="description-wrapper">
                <div class="title">'.$row['pet_title'].'</div>
                <div class="description" style="height: auto;">'.stripslashes($row['pet_content']).'</div>
                <a href="legal300/index.php" class="link" target="_blank">legal300.vn</a>
            </div>';
	}

	//================================================ Petition Index =============================================
	//get list of all petition index
	if(isset($_POST['lstAllPetition'])){
		$sql = "SELECT * FROM `table_petitionletter`";
		$result = mysqli_query($conn, $sql);
		if(mysqli_num_rows($result) > 0){
			while ($row = mysqli_fetch_array($result)) {
				if($row['pet_ischecked']){
					$count_signed = 0;
					$par_petid = $row['pet_id'];
					$sql1 = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$par_petid'";
					$result1 = mysqli_query($conn, $sql1);
					if (mysqli_num_rows($result1) > -1){
						while ($row1 = mysqli_fetch_array($result1)) {
						    if($row1['par_issigned'])
						    	$count_signed++;
						}
					}
					
					echo '<li class="my_petition clearfix" pet_id="'.$row['pet_id'].'">
						<div class="col-md-3 img_wrapper">
							<img src="legal300/upload/images/'.$row['pet_image'].'" alt="">
						</div>
						<div class="my_petition_info col-md-9">';

						if($count_signed == $row['pet_target']){
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_reporting.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}
						else {
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_detail.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}

					echo '
							<div class="sign_target">
								<div class="progress">
									<div class="progress-bar" role="progressbar" style="width: '.($count_signed/$row['pet_target']*100).'%" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
							</div>
							<div class="row_buttons">
								<div class="sign_target_count">
									<span class="signs">'.$count_signed.'</span>/<span class="target">'.$row['pet_target'].'</span>
								</div>
								<!-- Insert Share Button Facebook Here -->
								<a href="" class="btn_share_facebook" id="share_button">
		                			<i class="fa fa-facebook"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Share on Facebook
		                		</a>';

		                	if($count_signed == $row['pet_target'])
		                		echo '<p class="text-uppercase full_signed">Đã đủ chữ ký</p>';

		            echo '
							</div>
						</div>
					</li>';
				}
			}
		}
	}

	//search petition letter
	if(isset($_POST['filterPetitionTitle'])){
		$title = $_POST['petTitle'];
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_title LIKE '%$title%'";
		$result = mysqli_query($conn, $sql);
		if(mysqli_num_rows($result) > 0){
			while ($row = mysqli_fetch_array($result)) {
				if($row['pet_ischecked']){
					$count_signed = 0;
					$par_petid = $row['pet_id'];
					$sql1 = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$par_petid'";
					$result1 = mysqli_query($conn, $sql1);
					if (mysqli_num_rows($result1) > -1){
						while ($row1 = mysqli_fetch_array($result1)) {
						    if($row1['par_issigned'])
						    	$count_signed++;
						}
					}
					
					echo '<li class="my_petition clearfix" pet_id="'.$row['pet_id'].'">
						<div class="col-md-3 img_wrapper">
							<img src="legal300/upload/images/'.$row['pet_image'].'" alt="">
						</div>
						<div class="my_petition_info col-md-9">';

						if($count_signed == $row['pet_target']){
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_reporting.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}
						else {
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_detail.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}

					echo '
							<div class="sign_target">
								<div class="progress">
									<div class="progress-bar" role="progressbar" style="width: '.($count_signed/$row['pet_target']*100).'%" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
							</div>
							<div class="row_buttons">
								<div class="sign_target_count">
									<span class="signs">'.$count_signed.'</span>/<span class="target">'.$row['pet_target'].'</span>
								</div>
								<!-- Insert Share Button Facebook Here -->
								<a href="" class="btn_share_facebook" id="share_button">
		                			<i class="fa fa-facebook"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Share on Facebook
		                		</a>';

		                	if($count_signed == $row['pet_target'])
		                		echo '<p class="text-uppercase full_signed">Đã đủ chữ ký</p>';

		            echo '
							</div>
						</div>
					</li>';
				}
			}
		}else {
			echo '<li class="my_petition clearfix"><div class="col-md-12 text-center">Không tìm thấy kết quả nào!</div></li>';
		}
	}

	//search petition letter
	if(isset($_POST['countAllSigned'])){
		$sql = "SELECT * FROM `table_petitionparticipants`";
		$result = mysqli_query($conn, $sql);
		$count = mysqli_num_rows($result);
		echo $count;
	}

	//================================================ Petition Dashboard =============================================
	//get list of petition dashboard
	if(isset($_POST['lstPetitionRequire'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_userid = $user_id";
		$result = mysqli_query($conn, $sql);
		if(mysqli_num_rows($result) > 0){
			while ($row = mysqli_fetch_array($result)) {
				if($row['pet_ischecked']){
					$count_signed = 0;
					$par_petid = $row['pet_id'];
					$sql1 = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$par_petid'";
					$result1 = mysqli_query($conn, $sql1);
					if (mysqli_num_rows($result1) > -1){
						while ($row1 = mysqli_fetch_array($result1)) {
						    if($row1['par_issigned'])
						    	$count_signed++;
						}
					}
					
					echo '<li class="my_petition clearfix" pet_id="'.$row['pet_id'].'">
						<div class="col-md-3 img_wrapper">
							<img src="legal300/upload/images/'.$row['pet_image'].'" alt="">
						</div>
						<div class="my_petition_info col-md-9">';

						if($count_signed == $row['pet_target']){
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_reporting.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}
						else {
							echo '
								<h3><a id="petition_title" href="legal300/petition/petition_detail.php?petId='.$row['pet_id'].'">'.$row['pet_title'].'</a></h3>';
						}

					echo '
							<div class="sign_target">
								<div class="progress">
									<div class="progress-bar" role="progressbar" style="width: '.($count_signed/$row['pet_target']*100).'%" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
							</div>
							<div class="row_buttons">
								<div class="sign_target_count">
									<span class="signs">'.$count_signed.'</span>/<span class="target">'.$row['pet_target'].'</span>
								</div>
								<!-- Insert Share Button Facebook Here -->
								<a href="" class="btn_share_facebook" id="share_button">
		                			<i class="fa fa-facebook"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Share on Facebook
		                		</a>';

		                	if($count_signed == $row['pet_target'])
		                		echo '<p class="text-uppercase full_signed">Đã đủ chữ ký</p>';

		            echo '
							</div>
						</div>
					</li>';
				}
			}
		}
	}

	//get info of user
	if(isset($_POST['getInfoOfUser'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$sql = "SELECT * FROM `table_usertemp` WHERE id = $user_id";
		$result = mysqli_query($conn, $sql);
		if(mysqli_num_rows($result) > 0){
			$row = mysqli_fetch_array($result);
			echo '<img src="legal300/upload/imagesuser/'.$row['user_image'].'" alt="" class="user_pic">
				<h3>'.decrypt($row['ten'], $key).'</h3>
				<a href="legal300/petition/detail_user.php" class="edit_profile">Chỉnh Sửa Thông Tin</a>';
		}
	}

	//================================================ Petition Detail =============================================
	// //check if form comment is submitted
	if(isset($_POST['formCommentSubmit'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$user_comment = $_POST['cmt_contents'];
		$pet_id = $_POST['petId'];
		date_default_timezone_set("Asia/Ho_Chi_Minh");
	    $date = date('Y-m-d H:i:s', time());
	    $reply_count = $_POST['lastReplyCount'];
	    $reply_count++;

		$sql = "INSERT INTO `table_petitioncomments` (`cmt_id`, `cmt_contents`, `cmt_creatingdate`, `cmt_userid`, `cmt_petid`) VALUES (NULL, '$user_comment', '$date', '$user_id', '$pet_id');";
		if(mysqli_query($conn, $sql)){
			$sql = "SELECT * FROM table_usertemp WHERE id = $user_id";
			$result = mysqli_query($conn, $sql);
			$row = mysqli_fetch_array($result);

			$user_image = $row['user_image'];
			$user_name = decrypt($row['ten'], $key);

			$sql = "SELECT * FROM `table_petitioncomments` ORDER BY cmt_creatingdate DESC LIMIT 1";
			$result = mysqli_query($conn, $sql);
			$row = mysqli_fetch_array($result);
			$new_cmt_id = $row['cmt_id'];

			echo '<div class="comment-wrap comment_user" cmtId="'.$new_cmt_id.'">
					<div class="photo">
						<div class="avatar" style="background-image: url(\'legal300/upload/imagesuser/'.$user_image.'\')"></div>
					</div>
					<div class="comment-block">
						<h4 class="text-uppercase">'.$user_name.'</h4>
						<p class="comment-text">'.$user_comment.'</p>
						<div class="bottom-comment">
							<div class="comment-date">'.$date.'</div>
							<ul class="comment-actions">
								<li class="reply" data-toggle="collapse" href="#add_cmt_reply'.$reply_count.'">Trả lời</li>
								<li class="cmt_reply collapsed" data-toggle="collapse" href="#reply_cmt'.$reply_count.'">0 Comments</li>
							</ul>
						</div>
					</div>
				</div>';
		}else{
			echo mysqli_error($conn);
		}
	}

	//sign petition
	if(isset($_POST['signPetition'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$pet_id = $_POST['petId'];		

	    if(isset($_POST['cmt_contents'])){
	    	$user_comment = $_POST['cmt_contents'];
	    	date_default_timezone_set("Asia/Ho_Chi_Minh");
	    	$date = date('Y-m-d H:i:s', time());

	    	$sql = "INSERT INTO `table_petitionparticipants` (`par_id`, `par_userid`, `par_money`, `par_issigned`, `par_petid`) VALUES (NULL, '$user_id', NULL, '1', '$pet_id');";
			if(mysqli_query($conn, $sql)){
				$sql = "INSERT INTO `table_petitioncomments` (`cmt_id`, `cmt_contents`, `cmt_creatingdate`, `cmt_userid`, `cmt_petid`) VALUES (NULL, '$user_comment', '$date', '$user_id', '$pet_id');";
				if(!mysqli_query($conn, $sql))
					echo mysqli_error($conn);
			}else {
				echo mysqli_error($conn);
			}
	    }else {
	    	$sql = "INSERT INTO `table_petitionparticipants` (`par_id`, `par_userid`, `par_money`, `par_issigned`, `par_petid`) VALUES (NULL, '$user_id', NULL, '1', '$pet_id');";
			if(!mysqli_query($conn, $sql))
				echo mysqli_error($conn);
	    }
	}

	//add comment reply textarea
	if(isset($_POST['addCommentReplyTextarea'])){
		$image = $_POST['user_image'];
		$cmt_id = $_POST['cmt_id'];
		echo '<div class="comment-wrap comment_wrap_reply">
				<div class="photo">
					<div class="avatar avatar_reply" style="background-image: url(\''.$image.'\')"></div>
				</div>
				<div class="comment-block">
					<form id="form_comment_reply" cmtId = '.$cmt_id.'>
						<textarea name="" id="txtareaCmtReply" cols="30" rows="3" placeholder="Add comment..."></textarea>
						<input type="submit" value="Trả Lời" id="btn_submit_comment">
					</form>
				</div>
			</div>';
	}

	//add comment reply to DB
	if(isset($_POST['addCommentReplyRequire'])){
		$rep_contents = $_POST['repContents'];
		date_default_timezone_set("Asia/Ho_Chi_Minh");
    	$date = date('Y-m-d H:i:s', time());
    	$rep_cmtid = $_POST['cmt_id'];
    	$collapse_id = $_POST['collapseId'];
		$user_id = $_SESSION['LegalUser']['userid'];
		
		$sql = "INSERT INTO `table_petitionreplycmt` (`rep_id`, `rep_contents`, `rep_date`, `rep_cmtid`, `rep_userid`) VALUES (NULL, '$rep_contents', '$date', '$rep_cmtid', '$user_id')";
		if(mysqli_query($conn, $sql)){
			$sql = "SELECT * FROM `table_petitionreplycmt` WHERE rep_cmtid = $rep_cmtid ORDER BY rep_date DESC";
			$result = mysqli_query($conn, $sql);

			echo '<div class="collapse div_reply" id="reply_cmt'.$collapse_id.'">
					<ul class="">';
			while($row = mysqli_fetch_array($result)){
				$user_id_temp = $row['rep_userid'];
				$sql1 = "SELECT * FROM `table_usertemp` WHERE id = $user_id_temp";
				$result1 = mysqli_query($conn, $sql1);
				$row1 = mysqli_fetch_array($result1);

				$user_image = $row1['user_image'];
				$user_name = decrypt($row1['ten'], $key);
				$rep_contents = $row['rep_contents'];
				$rep_date = $row['rep_date'];

				echo '
						<li class="">
							<div class="comment-wrap">
								<div class="photo">
									<div class="avatar" style="background-image: url(\'legal300/upload/imagesuser/'.$user_image.'\')"></div>
							  	</div>
							    <div class="comment-block">
							    	<h4 class="text-uppercase"><span class="glyphicon glyphicon-share-alt"></span>'.$user_name.'</h4>
							    	<p>'.$rep_contents.'</p>
							    	<div class="bottom-comment">
										<div class="comment-date">'.$rep_date.'</div>
									</div>
							    </div>
							</div>
						</li>';
			}
			echo '	</ul>
				</div>';
		}
	}

	//update count comment reply after adding cmt reply
	if(isset($_POST['updateCountCmtReply'])){
		$rep_cmtid = $_POST['cmt_id'];
		$sql = "SELECT * FROM `table_petitionreplycmt` WHERE rep_cmtid = $rep_cmtid";
		$result = mysqli_query($conn, $sql);
		echo mysqli_num_rows($result)." Comments";
	}

	//show hide see more button
	// if(isset($_POST['showHideSeeMoreBtn'])){
	// 	$count_cmts = $_POST['countCmts'];
	// 	$sql = "SELECT * FROM `table_petitioncomments`";
	// 	$result = mysqli_query($conn, $sql);
	// 	if(mysqli_num_rows($result) > $count_cmts){
	// 		echo 'block';
	// 	}else {
	// 		echo 'none';
	// 	}
	// }

	//show hide see more button
	if(isset($_POST['redirectRequire'])){
		$pet_id = $_POST['petId'];
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id = '$pet_id'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($result);
		$petTarget = $row['pet_target'];

		$sql = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$pet_id'";
		$result = mysqli_query($conn, $sql);
		$countSigned = mysqli_num_rows($result);

		echo ($countSigned == $petTarget)?1:0;
	}

	//check if a lawyer logined
	if(isset($_POST['checkLawyerRequire'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$pet_id = $_POST['petId'];
		$sql = "SELECT * FROM `table_usertemp` WHERE id=$user_id";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		if($row['role'] == 2){
			$sql_pet = "SELECT * FROM `table_petitionletter` WHERE pet_id='$pet_id'";
			$result_pet = mysqli_query($conn, $sql_pet);
			$row_pet = mysqli_fetch_assoc($result_pet);
			if(strpos($row_pet['pet_idlawyersinvolved'], $row['lawyer_id']) !== false){
				echo '<div class="agree_lawsuit" style="border-top: 1px solid #ccc">
						<h3>Bạn Đã Đồng Ý Tham Gia Vụ Này</h3>
					</div>';
			}else{
				echo '<div class="agree_lawsuit" style="border-top: 1px solid #ccc">
						<h3>Bạn Có Đồng Ý Tham Gia Vụ Này?</h3>
						<form action="" id="submit_sign_form">
							<div>
	                            <button class="btn btn_large btn-success" name="btn_agree" id="btn_agree" data-toggle="modal" data-target="#modal_agree_lawsuit">ĐỒNG Ý</button>
	                        </div>
						</form>
					</div>';
			}
		}
	}

	//button agree the lawsuit
	if(isset($_POST['agreeTheLawsuitRequire'])){
		$user_id = $_SESSION['LegalUser']['userid'];
		$sql = "SELECT * FROM `table_usertemp` WHERE id=$user_id";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);

		$pet_id = $_POST['petId'];
		$sql_pet = "SELECT * FROM `table_petitionletter` WHERE pet_id='$pet_id'";
		$result_pet = mysqli_query($conn, $sql_pet);
		$row_pet = mysqli_fetch_assoc($result_pet);
		$update_idlawyersinvolved = ltrim($row_pet['pet_idlawyersinvolved'].','.$row['lawyer_id'], ',');

		$sql_pet = "UPDATE `table_petitionletter` SET pet_idlawyersinvolved='$update_idlawyersinvolved' WHERE pet_id='$pet_id'";
		if(mysqli_query($conn, $sql_pet))
			echo '<div class="agree_lawsuit" style="border-top: 1px solid #ccc">
					<h3>Bạn Đã Đồng Ý Tham Gia Vụ Này</h3>
				</div>';
		else echo mysqli_error($conn);
	}

	//================================================ Petition Report Content =============================================
	//get report content
	if(isset($_POST['getReportContentRequire'])){
		$pet_id = $_POST['petId'];
		$sql = "SELECT * FROM `table_petitionparticipants` WHERE par_petid='$pet_id'";
		$result = mysqli_query($conn, $sql);

		$sql_pet = "SELECT * FROM `table_petitionletter` WHERE `pet_id` = '$pet_id'";
		$result_pet = mysqli_query($conn, $sql_pet);
		$row_pet = mysqli_fetch_assoc($result_pet);

		if(mysqli_num_rows($result) >= $row_pet['pet_target'])
			echo $row_pet['pet_reportContent'];
		else echo 0;
	}

	//get random petition
	if(isset($_POST['getRandomPetRequire'])){
		$sql = "SELECT * FROM `table_petitionletter`";
		$result = mysqli_query($conn, $sql);
		$count = mysqli_num_rows($result);

		$id_in = array(); $i = -1;
		$sql="SELECT * FROM `table_petitionletter` WHERE (RAND()*($count-5+1)+0) ORDER BY RAND() LIMIT 5";// >= 0 && <=$count
		$result = mysqli_query($conn, $sql);
		while($row=mysqli_fetch_assoc($result)){
			$id_in[$i++] = $row['pet_id'];
		}

		foreach ($id_in as $id) {
			$count_signed = 0;
			$sql_par = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$id'";
			$result_par = mysqli_query($conn, $sql_par);
			if (mysqli_num_rows($result_par) > -1){
				while ($row_par = mysqli_fetch_array($result_par)) {
				    if($row_par['par_issigned'])
				    	$count_signed++;
				}
			}

			$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id='$id'";
			$result = mysqli_query($conn, $sql);
			$row = mysqli_fetch_assoc($result);
			echo '<li class="row aside_pet">';
			if($count_signed == $row['pet_target'])
				echo '<a href="'._root_dirname.'/petition/petition_reporting.php?petId='.$row['pet_id'].'">';
			else
				echo '<a href="'._root_dirname.'/petition/petition_detail.php?petId='.$row['pet_id'].'">';
					echo '<div class="media">
							<div class="media-left col-sm-offset-1 col-sm-4 thumbnail aside_petimage">
								<img src="'._root_dirname.'/upload/images/'.$row['pet_image'].'" alt="" class="media-object" style="width:100%; ">
							</div>
							<div class="media-body col-md-7 aside_petcontent">
								<h4 class="media-heading text-center aside_pettitle">'.$row['pet_title'].'</h4>
								<p class="text-center">'.shorten_string($row['pet_content'], 70).'</p>
							</div>
						</div>
					</a>
				</li>';
		}
	}
?>