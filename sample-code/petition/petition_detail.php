<?php
	session_start();
	include_once "lib/db.php";
	include_once "lib/lqc_function.php";
	if (!isset($_SESSION["LegalUser"])) {
		header("location:login.php");
	}

	if(!isset($_GET['petId'])){
		header("location:petition_index.php");
	}else {
		$pet_id = $_GET['petId'];
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id = '$pet_id'";
		$result = mysqli_query($conn, $sql);
		if($count = mysqli_num_rows($result) < 1)
			header("location:petition_index.php");
	}

	$mang_nn = array("vi","en","tq");
	if(!isset($_SESSION["nn"])){
		$_SESSION["nn"]="vi";
	}
	if(isset($_GET["lang"])){
		$lang = $_GET["lang"];
		if(in_array($lang,$mang_nn))
		$_SESSION["nn"] = $lang;
	}

	switch($_SESSION["nn"]){
		case "vi": require "../languages/vi.php";
		break;
		case "tq": require "../languages/tq.php";
		break;
		case "en": require "../languages/en.php";
		break;
		default: require "../languages/vi.php";
	}

	$ten = "ten_".$_SESSION["nn"];
	$mota = "mota_".$_SESSION["nn"];
	$mota1 = "mota1_".$_SESSION["nn"];
	$mota2 = "mota2_".$_SESSION["nn"];
	$noidung = "noidung_".$_SESSION["nn"];
	$xuatxu = "xuatxu_".$_SESSION["nn"];
	$diachi = "diachi_".$_SESSION["nn"];
	$diachi2 = "diachi2_".$_SESSION["nn"];
	$title = "title_".$_SESSION["nn"];
	$photo = "photo_".$_SESSION["nn"];
	$ngaydang = "ngaydang_".$_SESSION["nn"];
	$thoidiem = "thoidiem_".$_SESSION["nn"];
	
	$thongtin = "thongtin_".$_SESSION["nn"];
	$vitri = "vitri_".$_SESSION["nn"];
	$tienich = "tienich_".$_SESSION["nn"];
	$matbang = "matbang_".$_SESSION["nn"];
	$tiendo = "tiendo_".$_SESSION["nn"];
	$tintuc = "tintuc_".$_SESSION["nn"];
	$video = "video_".$_SESSION["nn"];
	$hinhanh = "hinhanh_".$_SESSION["nn"];
	$giaodich = "giaodich_".$_SESSION["nn"];
	$copy = "copy_".$_SESSION["nn"];
	
	date_default_timezone_set('Asia/Ho_Chi_Minh');
	error_reporting(E_ALL & ~E_NOTICE & ~8192);

	$session=session_id();
	@define ( '_template' , '../templates/');
	@define ( '_source' , '../sources/');
	@define ( '_lib' , '../admin/lib/');

	include_once _lib."config.php";
	
	@define ( '_kiemtraweb', $check_website);  //Một đoạn mã dành riêng cho 1 website.
	
	include_once _lib."constant.php";
	include_once _lib."functions.php";
	include_once _lib."q_functions.php";	//Các hàm bổ sung
	include_once _lib."functions_giohang.php";
	include_once _lib."class.database.php";
	include_once _lib."file_requick.php";
	include_once _lib."new.php";

	if($_REQUEST['command']=='add' && $_REQUEST['productid']>0){
		$pid=$_REQUEST['productid'];
		$nid=($_REQUEST['productnum'])?$_REQUEST['productnum']:1;
			addtocart($pid,$nid);
			redirect("gio-hang.html");
	}

?>

<!DOCTYPE html>
<html>
<head>
	<head>
		<base href="http://<?=$config_url?>/" />

		<meta charset="utf-8">
		<meta name="description" content="<?=$description?>" />
		<meta name="keywords" content="<?=$keywords?>" />
		<meta name="robots" content="noodp,index,follow" />
		<meta name='revisit-after' content='7 days' />
		<meta http-equiv="content-language" content="vi" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<?php 
		$d->reset();
		$sql="select photo from #_tinnho where id=110";
		$d->query($sql);
		$favicon = $d->fetch_array();
	?>
	<link href="<?=_upload_tinnho_l.$favicon['photo']?>" rel="shortcut icon" type="image/x-icon" />
	<meta name = "viewport" content = "user-scalable=no, width=device-width">

	<meta name="author" content="" />
	<meta name="copyright" content="" />
	<?php $title_bar = str_replace("-"," ",$title_bar) ?>
	<title><?=$title_bar?></title>

	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/hover-min.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/csschung.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/menutulam.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/style.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/reponsive.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/css/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/admin/media/assets/bootstrap/css/bootstrap_3.3.7.min.css">

	<!-- First, add jQuery (and jQuery UI if using custom easing or animation -->
	<!-- <?php if($com=='san-pham'){ ?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery-1.7.2.js"></script>

	<?php }else{?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery-2.2.1.js"></script>
	<?php }?> -->
	<script src="https://code.jquery.com/jquery-3.3.1.min.js" type="text/javascript"></script>

	<script type="text/javascript" src="<?php echo _root_dirname; ?>/js/jquery.mmenu.all.min.js"></script>
	<script type="text/javascript">
		$(function() {
			$('nav#menu').mmenu();
		});
	</script>

	<div id="fb-root"></div>
	<script>
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.5";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
	<?php include_once _template."layout/tienich/facebook/cauhinh_face.php"; ?>

	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery.mousewheel.min.js"></script>   
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/ImageScroller.js"></script>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/admin/media/assets/bootstrap/js/bootstrap.min.js"></script>

	<!--wow js-->
	   	<script type="text/javascript" src="<?php echo _root_dirname; ?>/js/wow.min.js"></script>
		<script>
			new WOW().init();
		</script>
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/css/animate.css">

	<?php 
	if(@$_GET['com']=='lien-he' || @$_GET['com']=='map'){
	?>
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/js/tabcontent/template1/tabcontent.css">
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/map.css">
	<?php
	}
	?>

	<!--GOOGLE ANALYTICS + GOOGLE WEBMASTER-->
	<?=$company['script']?>
	<?=$company['vchat']?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/admin/ckeditor/ckeditor.js"></script>
	<script>
		$(document).ready(function() {
			
			$('.ck_editors').each(function(index, el) {
				var id = $(this).attr('id');
				CKEDITOR.replace( id, {
				height : 500,
				entities: false,
				skin: 'moono',
		        basicEntities: false,
		        entities_greek: false,
		        entities_latin: false,
				filebrowserBrowseUrl : 'ckfinder/ckfinder.html',
				filebrowserImageBrowseUrl : 'ckfinder/ckfinder.html?type=Images',
				filebrowserFlashBrowseUrl : 'ckfinder/ckfinder.html?type=Flash',
				filebrowserUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
				filebrowserImageUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
				filebrowserFlashUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash',
				allowedContent:
					'h1 h2 h3 h4 h5 h6 p blockquote strong em;' +
					'a[!href];' +
					'img(left,right)[!src,alt,width,height];' +
					'table tr th td caption;' +
					'span{!font-family};' +
					'span{!color};' +
					'span(!marker);' +
					'del ins'
				});

			});

		});
		
	</script>​

<!-- =========================   Add some custom for this page   =====================  -->
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/petition_detail.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/style.css">
	<script src="https://cdn.rawgit.com/vaakash/jquery-collapser/master/jquery.collapser.min.js"></script>
	<script src="<?php echo _root_dirname; ?>/admin/petition/js/matchMedia.js"></script>
<!-- ================================================================================  -->

</head>

<?php 
	$d->reset();
	$sql="select photo from #_tinnho where id=53";
	$d->query($sql);
	$logotc = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=109";
	$d->query($sql);
	$bannertc = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=114";
	$d->query($sql);
	$hinhphaituvan = $d->fetch_array();


	$d->reset();
	$sql="select photo from #_tinnho where id=93";
	$d->query($sql);
	$bgfooter = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=167";
	$d->query($sql);
	$slogan = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=168";
	$d->query($sql);
	$bgbaotrongoi = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=169";
	$d->query($sql);
	$bgluatsutieubieu = $d->fetch_array();

?>
<?php 
	$d->reset();
	$sql="select photo from #_tinnho where id=93";
	$d->query($sql);
	$bgfooter = $d->fetch_array();
?>
<style>
	#khungbaogiatc1{width:100%;height:514px;float:left;background:url(<?=_upload_tinnho_l.$bgbaotrongoi['photo']?>)no-repeat top center}
	#khungluatsutieubieutc1{width:100%;float:left;height:770px;background:url(<?=_upload_tinnho_l.$bgluatsutieubieu['photo']?>)no-repeat top center}
	#khungslogantc1{width:100%;height:453px;background:url(<?=_upload_tinnho_l.$slogan['photo']?>)no-repeat top center;float:left}
	/* CUSTOM CSS */

</style>

<?php if($com!=''&&$com!='trang-chu'){ ?>
	<style>
	#khungdangkytuvantc1{padding-top:0px}
	</style>
<?php
}
?>

<body style="display:none">
	<?php 
		include_once _template."layout/tu/tu.php"; 
		include_once _template."layout/tienich/loadtrang.php";
	?>
	<script type="text/javascript">
	    $(document).ready(function () {
	        $(".language a").on('click', function () {
	            var language = $(this).attr('data-lang');
	            var href_cur = window.location.href;

	            $.ajax({
	                type: 'POST',
	                url: 'changelang.php',
	                data: {
	                    change: language,
	                },
	                dataType: 'html',
	                success: function (a) {
	                    if (a == 1) {
	                        location.href = href_cur;
	                    }
	                }
	            });
	        });
	    });

	</script>

	<?php if($_SESSION["nn"]=='tq'){ ?>
		<style>
		#menuchinhphai ul li{
			padding-left: 43px;
		    padding-right: 43px;}
		</style>
	<?php }?>

	<div id="wrapper">
		<div id="logodt"><a href="<?php echo _root_dirname; ?>/./"><img src="<?=_upload_tinnho_l.$logotc['photo']?>" alt="logo"/></a></div>
		<div id="menurere"><?php include_once _template."layout/menu/menure.php"; ?></div>
		<div id="headertc1">
			<div id="headertc2">
				<a href="<?php echo _root_dirname; ?>/trang-chu.html"><img id="logotc" src="<?=_upload_tinnho_l.$logotc['photo']?>" alt="logo"/></a>
				
				<?php 
					if(isset($_SESSION['LegalUser'])){?>
					<div id="dangnhapthanhcong" class="dropdown">
						<a class="dropdown-toggle parent_dropdown" data-toggle="dropdown">
							Chào mừng, <?php echo $_SESSION["LegalUser"]['fullname']; ?>
	    					<span class="caret"></span>
	    				</a>
						<ul class="dropdown-menu" style="float: right;">
							<li><a href="<?php echo _root_dirname; ?>/petition/profile.html" >Thông tin cá nhân</a></li>
							<li class="divider"></li>
							<li><a href="<?php echo _root_dirname; ?>/petition/change_password.html" >Đổi mật khẩu</a></li>
							<li class="divider"></li>
							<li><a href="<?php echo _root_dirname; ?>/petition/logout.php" >Đăng xuất</a></li>
						</ul>
					</div>
				<?php }else{?>
					<div id="dangkydangnhaptc">
						<a href="<?php echo _root_dirname; ?>/petition/login.php">Đăng nhập</a>
						<a href="<?php echo _root_dirname; ?>/petition/register.php">Đăng ký</a>
					</div>
				<?php } ?>
				<a id="chutuvanmienphitc" href="<?php echo _root_dirname; ?>/tu-van-mien-phi.html" >Tư vấn miễn phí</a>
				
				<a id="sohotlinetc" href="tel:<?=$company['dienthoai']?>">HOTLINE: <?=$company['dienthoai']?></a>
				<div id="khungtimkiemtc"><?php include_once _template."layout/timkiem/timkiem.php"; ?></div>
				
			</div>
		</div>
		<div id="menu1">
			<div id="menu2"><?php include_once _template."layout/menu/menutulam.php"; ?></div>
		</div>

		<!--Content-->
		<div class="row main_content">
			<div class="col-md-offset-1 col-md-10 middle_content">
				<article class="pet_content col-md-8"><!-- Start Showing Detail Petition -->
					<?php 
						$user_id = $_SESSION['LegalUser']['userid'];
						$pet_id = $_GET['petId'];
						$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id = '$pet_id'";
						$result = mysqli_query($conn, $sql);
						if(mysqli_num_rows($result) > 0){
							$row = mysqli_fetch_array($result);

							$count_cmt = 0;
							$sql1 = "SELECT * FROM `table_petitioncomments` WHERE cmt_petid = '$pet_id' ORDER BY cmt_creatingdate DESC";
							$result1 = mysqli_query($conn, $sql1);
							while ($row1 = mysqli_fetch_array($result1)) {
							    $count_cmt++;
							}
					?>

					<div class="pet_heading" style="margin-bottom: 0px;">
				        <h1 id="description"><?php echo $row['pet_title']; ?></h1>
				    </div>
				    <div class="pet_count_cmt_block clearfix">
				        <div class="pet_count_cmt media">
	                        <div class="media-body">
				                <a class="tab_comments">
				                    <span class="count"><?php echo $count_cmt; ?></span>
				                    <span class="text">Comments</span>
				                </a>
				            </div>
				        </div>
				    </div>
				    <div class="clearfix"></div>
			    	<section class="pet_description">
            			<!-- <img src="https://cdn.ipetitions.com/user-images/petitions/khong-d-tin/061a8928f17034630fd3a9a118fd327a.png" class="pet_img" id="js_pet_image">
            			<p></p><p>Thiếu tiền trầm trọng =(((</p><p></p> -->
            			<img src="<?php echo _root_dirname; ?>/upload/images/<?php echo $row['pet_image']; ?>" class="pet_img" id="js_pet_image">
            			<p></p><p><?php echo $row['pet_content']; ?></p><p></p>
                	</section>
					<section class="facebook-share-section">
			            <div class="sharebtn_area">
			            	<div class="sharebtn_contain">
			            		<div data-network="facebook" class="st-custom-button custom_facebook_sharebtn" data-url="<?php echo $row['pet_linkweb'] ?>" data-title="" data-description="" data-image=""><span class="fa fa-facebook-official fa-2x"></span><p class="custom_sharebtn_text">Share Facebook</p></div> 
								<div data-network="googleplus" class="st-custom-button custom_google_sharebtn" data-url="<?php echo $row['pet_linkweb'] ?>" data-title="" data-description="" data-image=""><span class="fa fa-google-plus fa-2x"></span><p class="custom_sharebtn_text">Share Google</p></div>
			            	</div>
			            </div>
			        </section>
			        <section id="comments">
			        	<div class="comments_control_panel">
					        <div class="comments_header">
					            <span class="comments_count"></span>
					            <h2>Comment</h2>
					        </div>
					        <div class="comments_container clearfix">
					        	<?php
					        		$sql1 = "SELECT * FROM `table_usertemp` WHERE id = $user_id";
									$result1 = mysqli_query($conn, $sql1);
									$row1 = mysqli_fetch_array($result1);
					        	?>

										<!-- Start Showing Add comment -->
							        	<div class="comment-wrap ">
											<div class="photo">
												<div class="avatar avatar_add_cmt_main" style="background-image: url('<?php echo _root_dirname; ?>/upload/imagesuser/<?php echo $row1['user_image']; ?>')"></div>
											</div>
											<div class="comment-block">
												<form id="form_comment">
													<textarea name="" id="txtareaCmt" cols="30" rows="3" placeholder="Add comment..."></textarea>
													<input type="submit" value="Gửi bình luận" id="btn_submit_comment">
												</form>
											</div>
										</div>
										<!-- Finish Showing Add comment -->

					        	<?php
					        		
					        	?>

								<!-- Start Showing comments -->
								<div class="show_comments">
								<?php
									$i = 0;//to count to show corresponding collapse
									//to show comments
									$sql1 = "SELECT * FROM `table_petitioncomments` WHERE cmt_petid = '$pet_id' ORDER BY cmt_creatingdate DESC";
									$result1 = mysqli_query($conn, $sql1);
									while ($row1 = mysqli_fetch_array($result1)) {
										$user_id = $row1['cmt_userid'];
										//to show info of user
										$sql2 = "SELECT * FROM `table_usertemp` WHERE id = $user_id";
										$result2 = mysqli_query($conn, $sql2);
										$row2 = mysqli_fetch_array($result2);

										$i++;//increase $i to assign corresponding collapse
										//to show comments reply
										$cmtId = $row1['cmt_id'];
										$sql3 = "SELECT * FROM `table_petitionreplycmt` WHERE rep_cmtid = '$cmtId' ORDER BY rep_date DESC";
										$result3 = mysqli_query($conn, $sql3);
										$count_cmt_reply = mysqli_num_rows($result3);
								?>
										<div class="comment-wrap comment_user" cmtId = "<?php echo $cmtId; ?>">
											<div class="photo">
												<div class="avatar" style="background-image: url('<?php echo _root_dirname; ?>/upload/imagesuser/<?php echo $row2['user_image']; ?>')"></div>
											</div>
											<div class="comment-block">
												<h4 class="text-uppercase"><?php echo decrypt($row2['ten'], $key); ?></h4>
												<p class="comment-text"><?php echo $row1['cmt_contents']; ?></p>
												<div class="bottom-comment">
													<div class="comment-date"><?php echo $row1['cmt_creatingdate']; ?></div>
													<ul class="comment-actions">
														<li class="reply" data-toggle="collapse" href="#add_cmt_reply<?php echo $i; ?>">Trả lời</li>
														<li class="cmt_reply collapsed" data-toggle="collapse" href="#reply_cmt<?php echo $i; ?>"><?php echo $count_cmt_reply; ?> Comments</li>
													</ul>
												</div>
											</div>
										</div>
										
									<?php
										if(mysqli_num_rows($result3) > 0){
									?>
										<div class="collapse div_reply" id="reply_cmt<?php echo $i; ?>">
											<ul class="">
									<?php
											while ($row3 = mysqli_fetch_array($result3)) {
												//to show info of user of comments reply
												$userid_reply = $row3['rep_userid'];
												$sql4 = "SELECT * FROM `table_usertemp` WHERE id = $userid_reply";
												$result4 = mysqli_query($conn, $sql4);
												$row4 = mysqli_fetch_array($result4);
									?>
												<li class="">
													<div class="comment-wrap">
														<div class="photo">
															<div class="avatar" style="background-image: url('<?php echo _root_dirname; ?>/upload/imagesuser/<?php echo $row4['user_image']; ?>')"></div>
													  	</div>
													    <div class="comment-block">
													    	<h4 class="text-uppercase"><span class="glyphicon glyphicon-share-alt"></span> <?php echo decrypt($row4['ten'], $key); ?></h4>
													    	<p><?php echo $row3['rep_contents']; ?></p>
													    	<div class="bottom-comment">
																<div class="comment-date"><?php echo $row3['rep_date']; ?></div>
															</div>
													    </div>
													</div>
												</li>
									<?php
											}
									?>
											</ul>
										</div>
								<?php
										}
									}
								?>
								</div>
								<!-- Finish Showing comments -->
								<div class="clearfix col-xs-offset-1 col-sm-10 col-xs-11">
									<a id="comments-load-more" class="load_more btn btn-default" href="#">See More</a>
								</div>
					        </div>
					    </div>
			        </section>

					<?php } ?><!-- Finish Showing Detail Petition -->
				</article>
				<aside class="col-md-4"><!-- Start Showing Signature -->
					<div class="sidebar_wrapper">
							<?php
								$user_id = $_SESSION['LegalUser']['userid'];
								$pet_id = $_GET['petId'];
								$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id = '$pet_id'";
								$result = mysqli_query($conn, $sql);
								if(mysqli_num_rows($result) > 0){
									$row = mysqli_fetch_array($result);
									if($row['pet_ischecked']){
										$count_signed = 0;
										$target = $row['pet_target'];

										$sql1 = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$pet_id'";
										$result1 = mysqli_query($conn, $sql1);
										if (mysqli_num_rows($result1) > -1){
											while ($row1 = mysqli_fetch_array($result1)) {
											    if($row1['par_issigned'])
											    	$count_signed++;
											}
										}
							?>
										<div class="signature_counter">
											<div class="progress_meter">
											    <div class="progress_line" style="width:<?php echo $count_signed/$target*100; ?>%"></div>
											</div>
											<span id="sign_count"><?php echo number_format($count_signed, 0, ".", ","); ?></span> Chữ ký<b>Mục tiêu: <?php echo number_format($target, 0, ".", ","); ?></b>
								
								        </div>

										<?php
											//to show username
											// $key = md5('vietnam');
											$sql2 = "SELECT * FROM `table_usertemp` WHERE id = $user_id";
											$result2 = mysqli_query($conn, $sql2);
											$row2 = mysqli_fetch_array($result2);

											//to show signed div or not signed div
											$sql1 = "SELECT * FROM `table_petitionparticipants` WHERE par_petid = '$pet_id' AND par_userid = $user_id";
											$result1 = mysqli_query($conn, $sql1);
											if(mysqli_num_rows($result1) > 0){
												$row1 = mysqli_fetch_array($result1);
												if($row1['par_issigned']){
										?>
											        <!-- Show when already signed -->
											        <div class="sign_form already_signed">
														<h2>BẠN ĐÃ KÝ CHO THỈNH NGUYỆN THƯ NÀY</h2>
														<p>Chào mừng <b><?php echo decrypt($row2['ten'], $key); ?></b>. <i>(nếu không phải <?php echo decrypt($row2['ten'], $key); ?>, <a href="<?php echo _root_dirname; ?>/petition/logout.php">nhấn vào đây</a>)</i></p>
											            <p>Qua trang <a href="<?php echo _root_dirname; ?>/petition/petition_dashboard.php">Hoạt Động</a> để xem các hoạt động và thông tin cá nhân của bạn.</p>
													</div>
										<?php
												}else{
										?>
													<!-- Show when no one signed -->
													<div class="sign_form not_signed_yet">
														<h2>Ký Ủng Hộ Thỉnh Nguyện Thư Này</h2>
														<form action="" id="submit_sign_form">
															<span class="signname"><?php echo decrypt($row2['ten'], $key); ?></span>
															<div class="sign-comment clearfix">
								                            <label for="txterea_comments">Comments</label>                            
								                            <textarea placeholder="Add comment..." name="" id="txterea_comments" rows="3"></textarea>
								                            <br>
								                            <button class="btn btn_large btn-success" name="sign_petition" id="sign_now">KÝ NGAY</button>
								                        </div>
														</form>
													</div>
										<?php
												}
											}else {
										?>
													<!-- Show when no one signed -->
													<div class="sign_form not_signed_yet">
														<h2>Ký Ủng Hộ Thỉnh Nguyện Thư Này</h2>
														<form action="" id="submit_sign_form">
															<span class="signname"><?php echo decrypt($row2['ten'], $key); ?></span>
															<div class="sign-comment clearfix">
								                            <label for="txterea_comments">Comments</label>                            
								                            <textarea placeholder="Add comment..." name="" id="txterea_comments" rows="3"></textarea>
								                            <br>
								                            <button class="btn btn_large btn-success" name="sign_petition" id="sign_now">KÝ NGAY</button>
								                        </div>
														</form>
													</div>
										<?php
											}
										?>
						<?php
									}
							}
						?>
													<!-- Show when user is a lawyer -->
													<!-- <div class="sign_form not_signed_yet" style="border-top: 1px solid #ccc">
														<h3>Bạn Có Đồng Ý Tham Gia Vụ Này?</h3>
														<form action="" id="submit_sign_form">
															<div>
									                            <button class="btn btn_large btn-success" name="btn_agree" id="btn_agree" data-toggle="modal" data-target="#modal_agree_lawsuit">ĐỒNG Ý</button>
									                        </div>
														</form>
													</div> -->
					</div>
				</aside><!-- Finish Showing Signature -->
			</div>
		</div>
		<br>
		<!--End Content-->

		<div id="footertc1">
			<div id="footertc2">
				<div id="footermot">
					<div class="tieudefooter"><h3><a><?=$company['ten_vi']?></a></h3></div>
					<div class="noidungfooter noidungfootermot">
					<?=$company[$mota]?>
					</div>
				</div>
				<div id="footerhai">
					<div class="tieudefooter"><h3><a>Dịch vụ nổi bật</a></h3></div>
					<div class="noidungfooter noidungfooterhai">
						<ul>
							<li><a href="<?php echo _root_dirname; ?>/tu-van-mien-phi.html">Tư viến miễn phí</a></li>
							<li><a href="<?php echo _root_dirname; ?>/tim-luat-su.html">Tìm kiếm luật sư</a></li>
							<li><a href="<?php echo _root_dirname; ?>/bao-gia-vu-viec.html">Báo giá vụ việc trọn gói</a></li> 
						</ul>
					</div> 
				</div>
				
				<div id="footerba">
					<div class="tieudefooter"><h3><a>Chính sách và hỗ trợ</a></h3></div>
					<div class="noidungfooter noidungfooterhai">
						<ul>
							<?php 
								$d->reset();
								$sql="select * from #_tinnho where hienthi=1 and com=7 order by stt asc";
								$d->query($sql);
								$chinhsachhotrotc = $d->result_array();
							?>
							<?php for($i=0;$i<count($chinhsachhotrotc);$i++){ 
								$v = $chinhsachhotrotc[$i];
							?>
							<li><a href="<?php echo _root_dirname; ?>/chinh-sach-ho-tro/<?=$v['tenkhongdau']?>-<?=$v['id']?>.html"><?=$v[$ten]?></a></li>
							<?php }?>
							
						</ul>
					</div> 
				</div>
				
				<div id="footerbon">
					<div class="tieudefooter"><h3><a>Liên Hệ</a></h3></div>
					<div class="noidungfooter noidungfootermot">
						<?=$company[$noidung]?>
					</div> 
				</div>
				
				<div id="mapfooter">
					<div class="tieudefooter"><h3><a>Bản đồ</a></h3></div>
					<div class="noidungfooter">
						<?php
			                $sql = "select * from #_company where com='toado' order by stt asc, id desc limit 0,1";
			                $d->query($sql);
			                $toado = $d->fetch_array();	
			            ?>
						<?=$toado['website']?>
					</div>	
				</div>
			</div>
		</div>
	</div>

	<!-- Modal -->
	<div id="modal_agree_lawsuit" class="modal fade" role="dialog">
	  <div class="modal-dialog">
	    <!-- Modal content-->
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	        <h4 class="modal-title">Xác Nhận Tham Gia Vụ Kiện</h4>
	      </div>
	      <div class="modal-body">
	        <p>Khi đã đồng ý thì sẽ không thể bỏ được. Bạn có chắc chắn tham gia vụ này?</p>
	      </div>
	      <div class="modal-footer">
	      	<button type="button" class="btn btn-success" id="btn_confirm_agree" data-dismiss="modal">Xác Nhận</button>
	        <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
	      </div>
	    </div>
	  </div>
	</div>

	<script src="<?php echo _root_dirname; ?>/petition/js/petition_detail.js" type="text/javascript"></script>
	<script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=5ae88a99256cbf0011980425&product=custom-share-buttons"></script>

</body>
</html>