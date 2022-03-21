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
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/petition_reporting.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/petition/css/style.css">
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

	<?php
		$pet_id = $_GET['petId'];
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id = '$pet_id'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($result);
	?>
		<!--Content-->
		<div class="row main_content">
			<div class="col-md-offset-1 col-md-10 middle_content">
				<h1 class="page_title col-md-12"><?php echo $row['pet_title']; ?></h1>
				<div class="col-md-8 left_content">
					<article class="pet_content col-md-12">
						<!-- <div class="pet_heading" style="margin-bottom: 0px;">
					        <h1 id="description">titlelelas asdasd</h1>
					    </div>
					    <div class="pet_count_cmt_block clearfix">
					        <div class="pet_count_cmt media">
		                        <div class="media-body">
					                <a class="tab_comments">
					                    <span class="count">100</span>
					                    <span class="text">Comments</span>
					                </a>
					            </div>
					        </div>
					    </div>
					    <div class="clearfix"></div> -->
				    	<!-- <section class="pet_description">
	            			<img src="https://cdn.ipetitions.com/user-images/petitions/khong-d-tin/061a8928f17034630fd3a9a118fd327a.png" class="pet_img" id="js_pet_image">
	            			<p></p><p>Thiếu tiền trầm trọng =(((</p><p></p>
	                	</section> -->
						<div id="report_content"></div>
					</article>
					<div id="hide_content"></div>
				</div>
				<div class="col-md-4 right_content">
					<div class="aside_heading">
						<h3 class="text-center text-uppercase">Các thỉnh nguyện thư khác</h3>
					</div>
					<aside class="aside_area">
						<ul id="lst_involve_pet">
							<!-- <li class="row aside_pet">
								<div class="media">
									<div class="media-left col-md-offset-1 col-md-10 thumbnail aside_petimage">
										<img src="https://cdn.ipetitions.com/user-images/petitions/khong-d-tin/061a8928f17034630fd3a9a118fd327a.png" alt="" class="media-object" style="width:100%; ">
									</div>
									<div class="media-body col-md-offset-1 col-md-10 aside_petcontent">
										<h4 class="media-heading text-center aside_pettitle">titlelelas asdasd</h4>
										<p class="text-center">Similar to the contextual text color classes, easily set the background of an element to any contextual class.</p>
									</div>
								</div>
							</li> -->
						</ul>
					</aside>
				</div>
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

	<script src="<?php echo _root_dirname; ?>/petition/js/petition_reporting.js" type="text/javascript"></script>

</body>
</html>