<?php
	session_start();
	if (isset($_SESSION["LegalUser"])) {
		header("location:petition_dashboard.php");
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
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/style.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/fonts/passion_one.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/fonts/oxygen.css">

	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/cropper.min.css">
	<script src="<?php echo _root_dirname; ?>/petition/js/cropper.min.js" type="text/javascript"></script>
	<script src="<?php echo _root_dirname; ?>/petition/js/register.js" type="text/javascript"></script>
	
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
				
				<div id="dangkydangnhaptc" class="dropdown">
				<?php 
					if(isset($_SESSION['LegalUser'])){?>
						<a class="dropdown-toggle parent_dropdown" data-toggle="dropdown">
							Chào mừng, <?php echo $_SESSION["LegalUser"]; ?>
	    					<span class="caret"></span>
	    				</a>
						<ul class="dropdown-menu" style="float: right;">
							<li><a href="<?php echo _root_dirname; ?>/petition/profile.html" >Thông tin cá nhân</a></li>
							<li class="divider"></li>
							<li><a href="<?php echo _root_dirname; ?>/petition/change_password.html" >Đổi mật khẩu</a></li>
							<li class="divider"></li>
							<li><a href="<?php echo _root_dirname; ?>/petition/logout.php" >Đăng xuất</a></li>
						</ul>
				<?php }else{?>
						<a href="<?php echo _root_dirname; ?>/petition/login.php">Đăng nhập</a>
						<a href="<?php echo _root_dirname; ?>/petition/register.php">Đăng ký</a>
				<?php } ?>
				</div>
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
			<div class="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6 col-xs-offset-2 col-xs-8 middle_content">
				<h3>Tạo Tài Khoản Để Có Thể Đăng Ký Thỉnh Nguyện Thư</h3>
				<form class="" method="post" action="<?php echo _root_dirname; ?>/petition/lib/register_handle.php">
					
					<div class="form-group">
						<label for="name" class="cols-sm-2 control-label">Họ Tên</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
								<input type="text" class="form-control" name="name" id="name"  placeholder="Nhập Họ Tên Của Bạn" required />
							</div>
						</div>
					</div>

					<div class="form-group" id="div_birthdate">
	                    <label for="birthDate" class="col-sm-4 control-label">Date of Birth</label>
	                    <div class="col-sm-8">
	                        <input type="date" name="birthDate" id="birthDate" class="form-control" min="1950-01-01" max="2000-12-31" required>
	                    </div>
	                </div>

					<div class="clearfix"></div>
					<div class="form-group div_sel_sex">
						<label for="sex" class="col-lg-2 col-md-3 col-xs-4 control-label">Giới Tính</label>
						<div class="col-lg-3 col-md-4 col-xs-4">
							<select name="user_sex" id="sel_sex">
							  <option value="1"><strong>Nam</strong></option>
							  <option value="0"><strong>Nữ</strong></option>
							</select>
						</div>
					</div>
					<div class="clearfix"></div>

					<div class="form-group row">
						<label for="image" class="col-xs-6 col-md-5 col-lg-4 control-label">Hình Đại Diện</label>
						<div class="clearfix"></div>
						<div class="row">
							<div class="col-md-offset-1 col-md-3 col-xs-offset-1 col-xs-4" id="register_img">
								<img src="<?php echo _root_dirname; ?>/upload/imagesuser/default_avatar.jpg" alt="" id="show_profile_image">
							</div>
							<div class="col-md-offset-0 col-md-7 col-xs-offset-1 col-xs-10" id="choose_profile_image">
								<input type="file" class="form-control" name="profile_image" id="profile_image" value="default_avatar.jpg" accept="image/*">
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="email" class="cols-sm-2 control-label">Email</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
								<input type="text" class="form-control" name="email" id="email"  placeholder="Nhập Email Của Bạn" required />
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="password" class="cols-sm-2 control-label">Địa Chỉ</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								<input type="text" class="form-control" name="address" id="address"  placeholder="Nhập Địa Chỉ Của Bạn" required />
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="password" class="cols-sm-2 control-label">Điện Thoại</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								<input type="tel" class="form-control" name="telephone" id="telephone"  placeholder="Nhập Địa Chỉ Của Bạn" required />
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="username" class="cols-sm-2 control-label">Tên Tài Khoản</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
								<input type="text" class="form-control" name="username" id="username"  placeholder="Nhập Tên Tài Khoản" required />
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="password" class="cols-sm-2 control-label">Mật Khẩu</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								<input type="password" class="form-control" name="password" id="password"  placeholder="Nhập Mật Khẩu Của Bạn" required />
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="confirm" class="cols-sm-2 control-label">Nhập Lại Mật Khẩu</label>
						<div class="cols-sm-10">
							<div class="input-group">
								<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								<input type="password" class="form-control" name="confirm_password" id="confirm_password"  placeholder="Nhập Lại Mật Khẩu Của Bạn" required />
							</div>
							<span id='message'></span>
						</div>
					</div>

					<div class="form-group col-md-offset-4 col-md-4">
						<input type="submit" class="btn btn-primary btn-lg btn-block login-button" value="Đăng Ký">
					</div>
					
				</form>
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

</body>
</html>