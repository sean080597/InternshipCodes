<?php
	session_start();
	if (!isset($_SESSION["LegalUser"])) {
		//header("location:login.php");
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
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/admin/media/assets/bootstrap/css/bootstrap.min.css">

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
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/petition_registration.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/style.css">
	<!--Add tinymce editor-->
	<script src="<?php echo _root_dirname; ?>/admin/tiny_mce/tiny_mce.js"></script>

	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/cropper.min.css">
	<script src="<?php echo _root_dirname; ?>/petition/js/cropper.min.js" type="text/javascript"></script>
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
	table#petition_content_tbl {
	    width: 100% !important;
	}
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
		<div class="row">
			<div class="col-sm-2 col-md-2"></div>
			<div class="col-xs-12 col-sm-10 col-md-8">
				<div class="col-xs-12 col-sm-10 col-md-10">
					<h1>Tạo thỉnh nguyện thư</h1>
					<div class="headline">
						<p>Tạo một thỉnh nguyện thư trong vài phút. Dễ tạo, dễ chỉnh sửa, dễ sử dụng. Hoàn toàn miễn phí.</p>
						<p>Bắt đầu bằng việc điền mẫu này, và trong vài phút bạn đã sẵn sàng để thu thập chữ ký của mọi người.</p>
					</div>
					<br>
				</div>

				<div class="col-xs-12 col-sm-10 col-md-10 clearfix">
					<form method="POST" class="Questionnaire_form" id="Questionnaire_form">
						<fieldset>
							<section class="pet_title">
								<label for="QuestionnaireForm_title" class="required">Tiêu đề <span class="required">*</span>
								</label>
								<div>
									<input id="QuestionnaireForm_title" type="text" maxlength="150" name="petition_title">
									<div class="errorMessage" id="QuestionnaireForm_title_em_" style="display:none"></div>
								</div>
							</section>
							<section class="pet_title">
								<label for="QuestionnaireForm_target" class="required">Mục tiêu số chữ ký <span class="required">*</span>
								</label>
								<div class="clearfix"></div>
								<div class="col-xs-4 pet_target">
									<input id="QuestionnaireForm_target" type="number" name="petition_target" onkeydown="javascript: return event.keyCode == 69 || event.keyCode == 189 ? false : true">
								</div>
								<div class="col-xs-7">
									<div class="errorMessage" id="QuestionnaireForm_target_em_" style="display:none"></div>
								</div>
							</section>
							<section class="pet_title">
								<label for="QuestionnaireForm_content" class="required">Nội dung <span class="required">*</span>
								</label>
								<div>
									<textarea class="tinymce" id="petition_content"></textarea>
									<div class="errorMessage" id="QuestionnaireForm_content_em_" style="display:none"></div>
								</div>

								<script>
									tinymce.init({ selector:'textarea',entity_encoding: "raw",editor_selector: "tinyMCE",relative_urls : false,convert_urls : false});
								</script>

							</section>
							<section class="pet_title">
								<label for="QuestionnaireForm_image" class="required">Hình ảnh <span class="required">*</span>
								</label>
								<div id="upload_drop_image" style="display: ">
								    <input type="file" id="fileBrowser" name="fileBrowser" style="visibility:hidden; display:none;" accept="image/*">
								    <div id="dragandrophandler">
								        <div>Thả ảnh vào đây</div>
								        <small> hoặc </small>
								        <div id="p_button">Nhấn vào để chọn ảnh</div>
								    </div>
								    <div id="upload_image_error"></div>
								    <small class="desc">Hình ảnh chỉ nên rộng ít nhất 500px và cao 300px và tối đa là 10MB.</small>
								</div>
								<div id="show_drop_image" style="display: none; position: relative;">
									<img src="" alt="" id="cropbox">
									<div id="div_btn_cancel">
										<img src="<?php echo _root_dirname; ?>/upload/congtrinh/cancel_btn.png" id="btn_cancel">
									</div>
								</div>
								<div class="errorMessage" id="QuestionnaireForm_content_em_" style="display:none"></div>
							</section>

							<div id="data-container"></div>
							<section class="pet_title">
								<button id="submit_petition" class="btn btn-lg btn-primary">PUBLISH PETITION</button>
								<div id="petition-creation" style="display:none;"></div>
							</section>
						</fieldset>
					</form>
				</div>

				<!--div class="col-md-4 col-lg-4"></div-->
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

	<script src="<?php echo _root_dirname; ?>/petition/js/petition_registration.js" type="text/javascript"></script>

</body>
</html>